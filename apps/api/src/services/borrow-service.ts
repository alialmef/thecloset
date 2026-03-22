import prisma from '../lib/prisma';
import { NotFoundError, ConflictError, ForbiddenError } from '../lib/errors';

interface CreateBorrowRequestData {
  itemId: string;
  pickupMethod?: string;
  borrowDurationDays?: number;
}

export async function createBorrowRequest(
  borrowerId: string,
  data: CreateBorrowRequestData,
): Promise<ReturnType<typeof prisma.borrowRequest.create>> {
  const item = await prisma.item.findUnique({
    where: { id: data.itemId },
    select: { id: true, ownerId: true, status: true },
  });

  if (!item) {
    throw new NotFoundError('Item');
  }

  if (item.ownerId === borrowerId) {
    throw new ConflictError('You cannot borrow your own item');
  }

  if (item.status !== 'AVAILABLE') {
    throw new ConflictError('Item is not available for borrowing');
  }

  // Check for existing pending request from same borrower for same item
  const existingRequest = await prisma.borrowRequest.findFirst({
    where: {
      itemId: data.itemId,
      borrowerId,
      status: 'PENDING',
    },
  });

  if (existingRequest) {
    throw new ConflictError('You already have a pending request for this item');
  }

  return prisma.borrowRequest.create({
    data: {
      itemId: data.itemId,
      borrowerId,
      ownerId: item.ownerId,
      pickupMethod: (data.pickupMethod ?? 'IN_PERSON') as 'IN_PERSON' | 'DELIVERY',
      borrowDurationDays: data.borrowDurationDays ?? 7,
    },
    include: {
      item: true,
      borrower: { select: { id: true, name: true, avatarUrl: true } },
      owner: { select: { id: true, name: true, avatarUrl: true } },
    },
  });
}

export async function respondToBorrowRequest(
  requestId: string,
  ownerId: string,
  status: 'APPROVED' | 'DECLINED',
): Promise<ReturnType<typeof prisma.borrowRequest.update>> {
  const request = await prisma.borrowRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new NotFoundError('Borrow request');
  }

  if (request.ownerId !== ownerId) {
    throw new ForbiddenError('Only the item owner can respond to borrow requests');
  }

  if (request.status !== 'PENDING') {
    throw new ConflictError('This request has already been responded to');
  }

  // Use a transaction to prevent race conditions (double-lending)
  return prisma.$transaction(async (tx) => {
    if (status === 'APPROVED') {
      // Re-check item availability inside the transaction
      const item = await tx.item.findUnique({
        where: { id: request.itemId },
        select: { status: true },
      });

      if (!item || item.status !== 'AVAILABLE') {
        throw new ConflictError('Item is no longer available');
      }

      await tx.item.update({
        where: { id: request.itemId },
        data: { status: 'LENT' },
      });
    }

    return tx.borrowRequest.update({
      where: { id: requestId },
      data: {
        status,
        ...(status === 'APPROVED' && { approvedAt: new Date() }),
      },
      include: {
        item: true,
        borrower: { select: { id: true, name: true, avatarUrl: true } },
        owner: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  });
}

export async function returnItem(
  requestId: string,
  borrowerId: string,
): Promise<ReturnType<typeof prisma.borrowRequest.update>> {
  const request = await prisma.borrowRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new NotFoundError('Borrow request');
  }

  if (request.borrowerId !== borrowerId) {
    throw new ForbiddenError('Only the borrower can mark an item as returned');
  }

  if (request.status !== 'APPROVED' && request.status !== 'ACTIVE') {
    throw new ConflictError('This item is not currently borrowed');
  }

  // Update item back to available
  await prisma.item.update({
    where: { id: request.itemId },
    data: { status: 'AVAILABLE' },
  });

  return prisma.borrowRequest.update({
    where: { id: requestId },
    data: {
      status: 'RETURNED',
      returnedAt: new Date(),
    },
    include: {
      item: true,
      borrower: { select: { id: true, name: true, avatarUrl: true } },
      owner: { select: { id: true, name: true, avatarUrl: true } },
    },
  });
}

export async function getLentItems(ownerId: string): Promise<ReturnType<typeof prisma.borrowRequest.findMany>> {
  return prisma.borrowRequest.findMany({
    where: {
      ownerId,
      status: { in: ['APPROVED', 'ACTIVE'] },
    },
    include: {
      item: true,
      borrower: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { approvedAt: 'desc' },
  });
}

export async function getBorrowedItems(borrowerId: string): Promise<ReturnType<typeof prisma.borrowRequest.findMany>> {
  return prisma.borrowRequest.findMany({
    where: {
      borrowerId,
      status: { in: ['APPROVED', 'ACTIVE'] },
    },
    include: {
      item: true,
      owner: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { approvedAt: 'desc' },
  });
}

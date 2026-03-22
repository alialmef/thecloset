import prisma from '../lib/prisma';
import { NotFoundError, ConflictError } from '../lib/errors';

export async function createUser(
  name: string,
  phone: string,
  avatarUrl?: string,
): Promise<ReturnType<typeof prisma.user.create>> {
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    throw new ConflictError('A user with this phone number already exists');
  }

  return prisma.user.create({
    data: {
      name,
      phone,
      avatarUrl: avatarUrl ?? null,
    },
  });
}

export async function getUserById(
  userId: string,
): Promise<ReturnType<typeof prisma.user.findUnique>> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          ownedItems: true,
          memberships: true,
          createdOutfits: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
}

export async function getUserByPhone(
  phone: string,
): Promise<ReturnType<typeof prisma.user.findUnique>> {
  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
}

export async function updateUser(
  userId: string,
  data: { name?: string; avatarUrl?: string | null },
): Promise<ReturnType<typeof prisma.user.update>> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError('User');
  }

  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

export async function getUserStats(userId: string): Promise<{
  totalItems: number;
  availableItems: number;
  lentItems: number;
  borrowedItems: number;
  groupCount: number;
  outfitsCreated: number;
}> {
  const [totalItems, availableItems, lentItems, borrowedItems, groupCount, outfitsCreated] =
    await Promise.all([
      prisma.item.count({ where: { ownerId: userId } }),
      prisma.item.count({ where: { ownerId: userId, status: 'AVAILABLE' } }),
      prisma.borrowRequest.count({
        where: { ownerId: userId, status: { in: ['APPROVED', 'ACTIVE'] } },
      }),
      prisma.borrowRequest.count({
        where: { borrowerId: userId, status: { in: ['APPROVED', 'ACTIVE'] } },
      }),
      prisma.groupMembership.count({ where: { userId } }),
      prisma.outfit.count({ where: { createdBy: userId } }),
    ]);

  return { totalItems, availableItems, lentItems, borrowedItems, groupCount, outfitsCreated };
}

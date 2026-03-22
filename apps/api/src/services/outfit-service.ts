import prisma from '../lib/prisma';
import { NotFoundError } from '../lib/errors';

interface CreateOutfitData {
  styledFor: string;
  itemIds: string[];
  note?: string;
}

export async function createOutfit(
  createdBy: string,
  data: CreateOutfitData,
): Promise<ReturnType<typeof prisma.outfit.create>> {
  // Verify all items exist
  const items = await prisma.item.findMany({
    where: { id: { in: data.itemIds } },
    select: { id: true, status: true },
  });

  if (items.length !== data.itemIds.length) {
    const foundIds = new Set(items.map((i) => i.id));
    const missingIds = data.itemIds.filter((id) => !foundIds.has(id));
    throw new NotFoundError(`Items: ${missingIds.join(', ')}`);
  }

  // Verify the styled-for user exists
  const recipient = await prisma.user.findUnique({
    where: { id: data.styledFor },
    select: { id: true },
  });

  if (!recipient) {
    throw new NotFoundError('Styled-for user');
  }

  return prisma.outfit.create({
    data: {
      createdBy,
      styledFor: data.styledFor,
      note: data.note ?? null,
      items: {
        create: data.itemIds.map((itemId) => ({ itemId })),
      },
    },
    include: {
      items: {
        include: {
          item: true,
        },
      },
      creator: { select: { id: true, name: true, avatarUrl: true } },
      recipient: { select: { id: true, name: true, avatarUrl: true } },
    },
  });
}

export async function getOutfitById(outfitId: string): Promise<ReturnType<typeof prisma.outfit.findUnique>> {
  const outfit = await prisma.outfit.findUnique({
    where: { id: outfitId },
    include: {
      items: {
        include: {
          item: {
            include: {
              owner: { select: { id: true, name: true, avatarUrl: true } },
            },
          },
        },
      },
      creator: { select: { id: true, name: true, avatarUrl: true } },
      recipient: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  if (!outfit) {
    throw new NotFoundError('Outfit');
  }

  return outfit;
}

export async function getUserOutfits(
  userId: string,
  type: 'created' | 'received' = 'received',
  page = 1,
  limit = 20,
): Promise<{ outfits: Awaited<ReturnType<typeof prisma.outfit.findMany>>; total: number }> {
  const where = type === 'created' ? { createdBy: userId } : { styledFor: userId };

  const [outfits, total] = await Promise.all([
    prisma.outfit.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { item: true } },
        creator: { select: { id: true, name: true, avatarUrl: true } },
        recipient: { select: { id: true, name: true, avatarUrl: true } },
      },
    }),
    prisma.outfit.count({ where }),
  ]);

  return { outfits, total };
}

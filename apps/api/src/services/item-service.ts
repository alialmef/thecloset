import prisma from '../lib/prisma';
import { NotFoundError, ForbiddenError } from '../lib/errors';
import {
  Prisma,
  ItemCategory,
  ItemSeason,
  ItemOccasion,
  ItemVisibility,
  ItemStatus,
} from '@prisma/client';

interface CreateItemData {
  imageUrl: string;
  category: string;
  color: string;
  brand?: string;
  season: string;
  occasion: string;
  visibility?: string;
}

interface ItemFilters {
  category?: string;
  season?: string;
  occasion?: string;
  status?: string;
  color?: string;
}

export async function createItem(
  userId: string,
  data: CreateItemData,
): Promise<ReturnType<typeof prisma.item.create>> {
  return prisma.item.create({
    data: {
      ownerId: userId,
      imageUrl: data.imageUrl,
      category: data.category as ItemCategory,
      color: data.color,
      brand: data.brand ?? null,
      season: data.season as ItemSeason,
      occasion: data.occasion as ItemOccasion,
      visibility: (data.visibility ?? 'ALL_GROUPS') as ItemVisibility,
    },
  });
}

export async function getItemById(
  itemId: string,
): Promise<ReturnType<typeof prisma.item.findUnique>> {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      owner: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  if (!item) {
    throw new NotFoundError('Item');
  }

  return item;
}

export async function getUserItems(
  userId: string,
  filters: ItemFilters = {},
  page = 1,
  limit = 20,
): Promise<{ items: Awaited<ReturnType<typeof prisma.item.findMany>>; total: number }> {
  const where: Prisma.ItemWhereInput = {
    ownerId: userId,
    ...(filters.category && {
      category: filters.category as Prisma.EnumItemCategoryFilter['equals'],
    }),
    ...(filters.season && { season: filters.season as Prisma.EnumItemSeasonFilter['equals'] }),
    ...(filters.occasion && {
      occasion: filters.occasion as Prisma.EnumItemOccasionFilter['equals'],
    }),
    ...(filters.status && { status: filters.status as Prisma.EnumItemStatusFilter['equals'] }),
    ...(filters.color && { color: { contains: filters.color, mode: 'insensitive' } }),
  };

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.item.count({ where }),
  ]);

  return { items, total };
}

export async function updateItem(
  itemId: string,
  userId: string,
  data: Partial<CreateItemData> & { status?: string; isFavorite?: boolean },
): Promise<ReturnType<typeof prisma.item.update>> {
  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) {
    throw new NotFoundError('Item');
  }

  if (item.ownerId !== userId) {
    throw new ForbiddenError('You can only edit your own items');
  }

  const updateData: Prisma.ItemUpdateInput = {};
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
  if (data.color !== undefined) updateData.color = data.color;
  if (data.brand !== undefined) updateData.brand = data.brand;
  if (data.category !== undefined) updateData.category = data.category as ItemCategory;
  if (data.season !== undefined) updateData.season = data.season as ItemSeason;
  if (data.occasion !== undefined) updateData.occasion = data.occasion as ItemOccasion;
  if (data.visibility !== undefined) updateData.visibility = data.visibility as ItemVisibility;
  if (data.status !== undefined) updateData.status = data.status as ItemStatus;
  if (data.isFavorite !== undefined) updateData.isFavorite = data.isFavorite;

  return prisma.item.update({
    where: { id: itemId },
    data: updateData,
  });
}

export async function deleteItem(itemId: string, userId: string): Promise<void> {
  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) {
    throw new NotFoundError('Item');
  }

  if (item.ownerId !== userId) {
    throw new ForbiddenError('You can only delete your own items');
  }

  await prisma.item.delete({ where: { id: itemId } });
}

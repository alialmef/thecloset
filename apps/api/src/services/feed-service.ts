import prisma from '../lib/prisma';
import { NotFoundError } from '../lib/errors';

interface FeedItem {
  id: string;
  type: 'outfit' | 'borrow';
  createdAt: Date;
  actor: { id: string; name: string; avatarUrl: string | null };
  data: unknown;
}

export async function getGroupFeed(
  userId: string,
  page = 1,
  limit = 20,
): Promise<{ items: FeedItem[]; total: number }> {
  // Get all groups the user belongs to
  const memberships = await prisma.groupMembership.findMany({
    where: { userId },
    select: { groupId: true },
  });

  if (memberships.length === 0) {
    return { items: [], total: 0 };
  }

  const groupIds = memberships.map((m) => m.groupId);

  // Get all members in those groups
  const groupMembers = await prisma.groupMembership.findMany({
    where: { groupId: { in: groupIds } },
    select: { userId: true },
  });

  const memberIds = [...new Set(groupMembers.map((m) => m.userId))];

  // Fetch recent outfits created by group members
  const [outfits, outfitCount] = await Promise.all([
    prisma.outfit.findMany({
      where: { createdBy: { in: memberIds } },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true } },
        recipient: { select: { id: true, name: true, avatarUrl: true } },
        items: {
          include: {
            item: { select: { id: true, imageUrl: true, category: true, brand: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.outfit.count({ where: { createdBy: { in: memberIds } } }),
  ]);

  const feedItems: FeedItem[] = outfits.map((outfit) => ({
    id: outfit.id,
    type: 'outfit' as const,
    createdAt: outfit.createdAt,
    actor: outfit.creator,
    data: {
      recipient: outfit.recipient,
      note: outfit.note,
      items: outfit.items.map((oi) => oi.item),
    },
  }));

  return { items: feedItems, total: outfitCount };
}

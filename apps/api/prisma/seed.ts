import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function seed(): Promise<void> {
  console.warn('Seeding database...');

  // ─── Users ──────────────────────────────────────────

  const alice = await prisma.user.upsert({
    where: { phone: '+15551234001' },
    update: {},
    create: {
      name: 'Alice Chen',
      phone: '+15551234001',
      avatarUrl: null,
    },
  });

  const bob = await prisma.user.upsert({
    where: { phone: '+15551234002' },
    update: {},
    create: {
      name: 'Bob Martinez',
      phone: '+15551234002',
      avatarUrl: null,
    },
  });

  const chloe = await prisma.user.upsert({
    where: { phone: '+15551234003' },
    update: {},
    create: {
      name: 'Chloe Kim',
      phone: '+15551234003',
      avatarUrl: null,
    },
  });

  // ─── Group ──────────────────────────────────────────

  const group = await prisma.group.upsert({
    where: { inviteCode: 'SEED0001' },
    update: {},
    create: {
      name: 'The Crew',
      inviteCode: 'SEED0001',
      createdBy: alice.id,
    },
  });

  // ─── Memberships ───────────────────────────────────

  for (const user of [alice, bob, chloe]) {
    await prisma.groupMembership.upsert({
      where: { userId_groupId: { userId: user.id, groupId: group.id } },
      update: {},
      create: {
        userId: user.id,
        groupId: group.id,
        role: user.id === alice.id ? 'ADMIN' : 'MEMBER',
      },
    });
  }

  // ─── Items ──────────────────────────────────────────

  const items = [
    { ownerId: alice.id, category: 'TOP' as const, color: 'White', brand: 'Everlane', season: 'ALL_SEASON' as const, occasion: 'CASUAL' as const },
    { ownerId: alice.id, category: 'BOTTOM' as const, color: 'Blue', brand: 'Levi\'s', season: 'ALL_SEASON' as const, occasion: 'CASUAL' as const },
    { ownerId: alice.id, category: 'OUTERWEAR' as const, color: 'Black', brand: 'North Face', season: 'WINTER' as const, occasion: 'CASUAL' as const },
    { ownerId: bob.id, category: 'TOP' as const, color: 'Navy', brand: 'Ralph Lauren', season: 'FALL' as const, occasion: 'CASUAL' as const },
    { ownerId: bob.id, category: 'SHOES' as const, color: 'White', brand: 'Nike', season: 'ALL_SEASON' as const, occasion: 'ATHLETIC' as const },
    { ownerId: bob.id, category: 'ACCESSORY' as const, color: 'Brown', brand: null, season: 'ALL_SEASON' as const, occasion: 'CASUAL' as const },
    { ownerId: chloe.id, category: 'TOP' as const, color: 'Red', brand: 'Zara', season: 'SUMMER' as const, occasion: 'GOING_OUT' as const },
    { ownerId: chloe.id, category: 'BOTTOM' as const, color: 'Black', brand: 'Aritzia', season: 'ALL_SEASON' as const, occasion: 'GOING_OUT' as const },
    { ownerId: chloe.id, category: 'BAG' as const, color: 'Tan', brand: 'Coach', season: 'ALL_SEASON' as const, occasion: 'CASUAL' as const },
    { ownerId: chloe.id, category: 'SHOES' as const, color: 'Black', brand: 'Doc Martens', season: 'FALL' as const, occasion: 'CASUAL' as const },
  ];

  for (const item of items) {
    await prisma.item.create({
      data: {
        ...item,
        imageUrl: `https://placeholder.closet.app/items/${crypto.randomUUID()}.jpg`,
        status: 'AVAILABLE',
        visibility: 'ALL_GROUPS',
      },
    });
  }

  console.warn(`Seeded: ${3} users, ${1} group, ${items.length} items`);
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

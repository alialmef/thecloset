import prisma from '../lib/prisma';
import { NotFoundError, ConflictError, ForbiddenError } from '../lib/errors';
import { MAX_GROUP_MEMBERS, INVITE_CODE_LENGTH } from '@closet/shared';
import crypto from 'crypto';

function generateInviteCode(): string {
  return crypto
    .randomBytes(INVITE_CODE_LENGTH / 2)
    .toString('hex')
    .toUpperCase();
}

export async function createGroup(
  userId: string,
  name: string,
): Promise<ReturnType<typeof prisma.group.create>> {
  const inviteCode = generateInviteCode();

  const group = await prisma.group.create({
    data: {
      name,
      inviteCode,
      createdBy: userId,
      members: {
        create: {
          userId,
          role: 'ADMIN',
        },
      },
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      },
    },
  });

  return group;
}

export async function joinGroup(
  userId: string,
  inviteCode: string,
): Promise<ReturnType<typeof prisma.groupMembership.create>> {
  const group = await prisma.group.findUnique({
    where: { inviteCode },
    include: { _count: { select: { members: true } } },
  });

  if (!group) {
    throw new NotFoundError('Group');
  }

  if (group._count.members >= group.maxMembers) {
    throw new ConflictError(`Group is full (max ${MAX_GROUP_MEMBERS} members)`);
  }

  const existing = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId, groupId: group.id } },
  });

  if (existing) {
    throw new ConflictError('You are already a member of this group');
  }

  return prisma.groupMembership.create({
    data: {
      userId,
      groupId: group.id,
      role: 'MEMBER',
    },
    include: {
      group: true,
    },
  });
}

export async function getGroupById(
  groupId: string,
  userId: string,
): Promise<ReturnType<typeof prisma.group.findUnique>> {
  const membership = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId, groupId } },
  });

  if (!membership) {
    throw new ForbiddenError('You are not a member of this group');
  }

  return prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      },
    },
  });
}

export async function getUserGroups(
  userId: string,
): Promise<ReturnType<typeof prisma.group.findMany>> {
  return prisma.group.findMany({
    where: {
      members: { some: { userId } },
    },
    include: {
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

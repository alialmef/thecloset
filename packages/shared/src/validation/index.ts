import { z } from 'zod';

// ─── User ────────────────────────────────────────────

export const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  avatarUrl: z.string().url().optional(),
});

// ─── Group ───────────────────────────────────────────

export const createGroupSchema = z.object({
  name: z.string().min(1).max(50),
});

export const joinGroupSchema = z.object({
  inviteCode: z.string().length(8),
});

// ─── Item ────────────────────────────────────────────

export const createItemSchema = z.object({
  imageUrl: z.string().url(),
  category: z.enum(['TOP', 'BOTTOM', 'OUTERWEAR', 'SHOES', 'ACCESSORY', 'BAG']),
  color: z.string().min(1).max(50),
  brand: z.string().max(100).optional(),
  season: z.enum(['SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_SEASON']),
  occasion: z.enum(['CASUAL', 'FORMAL', 'ATHLETIC', 'GOING_OUT']),
  visibility: z.enum(['ALL_GROUPS', 'SPECIFIC_GROUPS', 'PRIVATE']).optional().default('ALL_GROUPS'),
});

export const updateItemSchema = z.object({
  category: z.enum(['TOP', 'BOTTOM', 'OUTERWEAR', 'SHOES', 'ACCESSORY', 'BAG']).optional(),
  color: z.string().min(1).max(50).optional(),
  brand: z.string().max(100).nullable().optional(),
  season: z.enum(['SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_SEASON']).optional(),
  occasion: z.enum(['CASUAL', 'FORMAL', 'ATHLETIC', 'GOING_OUT']).optional(),
  status: z.enum(['AVAILABLE', 'LENT', 'UNAVAILABLE']).optional(),
  visibility: z.enum(['ALL_GROUPS', 'SPECIFIC_GROUPS', 'PRIVATE']).optional(),
  isFavorite: z.boolean().optional(),
});

// ─── Outfit ──────────────────────────────────────────

export const createOutfitSchema = z.object({
  styledFor: z.string().uuid(),
  itemIds: z.array(z.string().uuid()).min(1).max(10),
  note: z.string().max(500).optional(),
});

// ─── Borrow Request ──────────────────────────────────

export const createBorrowRequestSchema = z.object({
  itemId: z.string().uuid(),
  pickupMethod: z.enum(['IN_PERSON', 'DELIVERY']).default('IN_PERSON'),
  borrowDurationDays: z.number().int().min(1).max(30).default(7),
});

export const updateBorrowRequestSchema = z.object({
  status: z.enum(['APPROVED', 'DECLINED', 'RETURNED']),
});

// ─── Query Params ────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const itemFilterSchema = z.object({
  category: z.enum(['TOP', 'BOTTOM', 'OUTERWEAR', 'SHOES', 'ACCESSORY', 'BAG']).optional(),
  season: z.enum(['SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_SEASON']).optional(),
  occasion: z.enum(['CASUAL', 'FORMAL', 'ATHLETIC', 'GOING_OUT']).optional(),
  status: z.enum(['AVAILABLE', 'LENT', 'UNAVAILABLE']).optional(),
  color: z.string().optional(),
});

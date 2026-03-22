// ─── User ────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string | null;
  createdAt: Date;
}

export type CreateUserInput = Pick<User, 'name' | 'phone'> & {
  avatarUrl?: string;
};

// ─── Group ───────────────────────────────────────────

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  maxMembers: number;
  createdAt: Date;
}

export type CreateGroupInput = Pick<Group, 'name'>;

// ─── Group Membership ────────────────────────────────

export enum GroupRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export interface GroupMembership {
  userId: string;
  groupId: string;
  role: GroupRole;
  joinedAt: Date;
}

// ─── Item ────────────────────────────────────────────

export enum ItemCategory {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  OUTERWEAR = 'OUTERWEAR',
  SHOES = 'SHOES',
  ACCESSORY = 'ACCESSORY',
  BAG = 'BAG',
}

export enum ItemSeason {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
  WINTER = 'WINTER',
  ALL_SEASON = 'ALL_SEASON',
}

export enum ItemOccasion {
  CASUAL = 'CASUAL',
  FORMAL = 'FORMAL',
  ATHLETIC = 'ATHLETIC',
  GOING_OUT = 'GOING_OUT',
}

export enum ItemStatus {
  AVAILABLE = 'AVAILABLE',
  LENT = 'LENT',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum ItemVisibility {
  ALL_GROUPS = 'ALL_GROUPS',
  SPECIFIC_GROUPS = 'SPECIFIC_GROUPS',
  PRIVATE = 'PRIVATE',
}

export interface Item {
  id: string;
  ownerId: string;
  imageUrl: string;
  category: ItemCategory;
  color: string;
  brand: string | null;
  season: ItemSeason;
  occasion: ItemOccasion;
  status: ItemStatus;
  visibility: ItemVisibility;
  isFavorite: boolean;
  createdAt: Date;
}

export type CreateItemInput = Pick<
  Item,
  'imageUrl' | 'category' | 'color' | 'season' | 'occasion'
> & {
  brand?: string;
  visibility?: ItemVisibility;
};

// ─── Outfit ──────────────────────────────────────────

export interface Outfit {
  id: string;
  createdBy: string;
  styledFor: string;
  itemIds: string[];
  note: string | null;
  createdAt: Date;
}

export type CreateOutfitInput = Pick<Outfit, 'styledFor' | 'itemIds'> & {
  note?: string;
};

// ─── Borrow Request ──────────────────────────────────

export enum BorrowRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
}

export enum PickupMethod {
  IN_PERSON = 'IN_PERSON',
  DELIVERY = 'DELIVERY',
}

export interface BorrowRequest {
  id: string;
  itemId: string;
  borrowerId: string;
  ownerId: string;
  status: BorrowRequestStatus;
  pickupMethod: PickupMethod;
  borrowDurationDays: number;
  requestedAt: Date;
  approvedAt: Date | null;
  returnedAt: Date | null;
}

export type CreateBorrowRequestInput = Pick<
  BorrowRequest,
  'itemId' | 'pickupMethod' | 'borrowDurationDays'
>;

// ─── Delivery ────────────────────────────────────────

export enum DeliveryProvider {
  UBER = 'UBER',
  DOORDASH = 'DOORDASH',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export interface Delivery {
  id: string;
  borrowRequestId: string;
  provider: DeliveryProvider;
  trackingUrl: string | null;
  status: DeliveryStatus;
  feeCents: number;
  createdAt: Date;
}

// ─── API Response ────────────────────────────────────

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

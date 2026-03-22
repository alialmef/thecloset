import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import { api } from '../services/api';
import { Item, Group, BorrowRequest, Outfit, User } from '@closet/shared';

// ─── Query Keys ──────────────────────────────────────

export const queryKeys = {
  user: (id: string) => ['user', id] as const,
  userMe: () => ['user', 'me'] as const,
  userStats: () => ['user', 'stats'] as const,
  items: (userId?: string) => ['items', userId ?? 'me'] as const,
  item: (id: string) => ['item', id] as const,
  groups: () => ['groups'] as const,
  group: (id: string) => ['group', id] as const,
  borrowRequestsLent: () => ['borrow-requests', 'lent'] as const,
  borrowRequestsBorrowed: () => ['borrow-requests', 'borrowed'] as const,
  outfits: (type: string) => ['outfits', type] as const,
  outfit: (id: string) => ['outfit', id] as const,
  feed: () => ['feed'] as const,
};

// ─── User ────────────────────────────────────────────

export function useCurrentUser(): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: queryKeys.userMe(),
    queryFn: () => api.get<User>('/users/me'),
  });
}

export function useUserStats(): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: queryKeys.userStats(),
    queryFn: () =>
      api.get<{
        totalItems: number;
        availableItems: number;
        lentItems: number;
        borrowedItems: number;
        groupCount: number;
        outfitsCreated: number;
      }>('/users/me/stats'),
  });
}

// ─── Items ───────────────────────────────────────────

export function useMyItems(filters?: Record<string, string>): ReturnType<typeof useQuery> {
  const params = new URLSearchParams(filters).toString();
  const path = params ? `/items?${params}` : '/items';
  return useQuery({
    queryKey: [...queryKeys.items(), filters],
    queryFn: () => api.get<{ items: Item[]; total: number }>(path),
  });
}

export function useUserItems(userId: string): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: queryKeys.items(userId),
    queryFn: () => api.get<{ items: Item[]; total: number }>(`/items/user/${userId}`),
  });
}

export function useItem(itemId: string): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: queryKeys.item(itemId),
    queryFn: () => api.get<Item>(`/items/${itemId}`),
    enabled: !!itemId,
  });
}

type CreateItemVariables = {
  imageUrl: string;
  category: string;
  color: string;
  season: string;
  occasion: string;
  brand?: string;
  visibility?: string;
};

export function useCreateItem(): UseMutationResult<Item, unknown, CreateItemVariables, unknown> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemVariables) => api.post<Item>('/items', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items() });
      queryClient.invalidateQueries({ queryKey: queryKeys.userStats() });
    },
  });
}

type UpdateItemVariables = { id: string } & Record<string, unknown>;

export function useUpdateItem(): UseMutationResult<Item, unknown, UpdateItemVariables, unknown> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateItemVariables) => api.patch<Item>(`/items/${id}`, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items() });
      queryClient.invalidateQueries({ queryKey: queryKeys.item(variables.id) });
    },
  });
}

export function useDeleteItem(): UseMutationResult<unknown, unknown, string, unknown> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => api.delete(`/items/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items() });
      queryClient.invalidateQueries({ queryKey: queryKeys.userStats() });
    },
  });
}

// ─── Groups ──────────────────────────────────────────

export function useMyGroups(): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: queryKeys.groups(),
    queryFn: () => api.get<Group[]>('/groups'),
  });
}

export function useGroup(groupId: string): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: queryKeys.group(groupId),
    queryFn: () => api.get<Group>(`/groups/${groupId}`),
    enabled: !!groupId,
  });
}

export function useCreateGroup(): UseMutationResult<Group, unknown, string, unknown> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.post<Group>('/groups', { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups() });
    },
  });
}

export function useJoinGroup(): UseMutationResult<unknown, unknown, string, unknown> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteCode: string) => api.post('/groups/join', { inviteCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groups() });
    },
  });
}

// ─── Borrow Requests ─────────────────────────────────

export function useLentItems(): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: queryKeys.borrowRequestsLent(),
    queryFn: () => api.get<BorrowRequest[]>('/borrow-requests/lent'),
  });
}

export function useBorrowedItems(): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: queryKeys.borrowRequestsBorrowed(),
    queryFn: () => api.get<BorrowRequest[]>('/borrow-requests/borrowed'),
  });
}

type CreateBorrowVariables = {
  itemId: string;
  pickupMethod?: string;
  borrowDurationDays?: number;
};

export function useCreateBorrowRequest(): UseMutationResult<
  BorrowRequest,
  unknown,
  CreateBorrowVariables,
  unknown
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBorrowVariables) => api.post<BorrowRequest>('/borrow-requests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.borrowRequestsLent() });
      queryClient.invalidateQueries({ queryKey: queryKeys.borrowRequestsBorrowed() });
    },
  });
}

type RespondBorrowVariables = { id: string; status: string };

export function useRespondToBorrowRequest(): UseMutationResult<
  BorrowRequest,
  unknown,
  RespondBorrowVariables,
  unknown
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: RespondBorrowVariables) =>
      api.patch<BorrowRequest>(`/borrow-requests/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.borrowRequestsLent() });
      queryClient.invalidateQueries({ queryKey: queryKeys.borrowRequestsBorrowed() });
      queryClient.invalidateQueries({ queryKey: queryKeys.items() });
    },
  });
}

export function useReturnItem(): UseMutationResult<BorrowRequest, unknown, string, unknown> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) =>
      api.post<BorrowRequest>(`/borrow-requests/${requestId}/return`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.borrowRequestsLent() });
      queryClient.invalidateQueries({ queryKey: queryKeys.borrowRequestsBorrowed() });
      queryClient.invalidateQueries({ queryKey: queryKeys.items() });
    },
  });
}

// ─── Outfits ─────────────────────────────────────────

export function useOutfits(type: 'created' | 'received' = 'received'): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: queryKeys.outfits(type),
    queryFn: () => api.get<{ outfits: Outfit[]; total: number }>(`/outfits?type=${type}`),
  });
}

type CreateOutfitVariables = { styledFor: string; itemIds: string[]; note?: string };

export function useCreateOutfit(): UseMutationResult<
  Outfit,
  unknown,
  CreateOutfitVariables,
  unknown
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOutfitVariables) => api.post<Outfit>('/outfits', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.outfits('created') });
      queryClient.invalidateQueries({ queryKey: queryKeys.outfits('received') });
      queryClient.invalidateQueries({ queryKey: queryKeys.feed() });
    },
  });
}

// ─── Feed ────────────────────────────────────────────

export function useFeed(): ReturnType<typeof useQuery> {
  return useQuery({
    queryKey: queryKeys.feed(),
    queryFn: () =>
      api.get<{
        items: Array<{
          id: string;
          type: string;
          createdAt: string;
          actor: { id: string; name: string; avatarUrl: string | null };
          data: unknown;
        }>;
        total: number;
      }>('/feed'),
  });
}

// ─── Upload ──────────────────────────────────────────

type PresignResponse = { uploadUrl: string; publicUrl: string; key: string; expiresIn: number };

export function usePresignUpload(): UseMutationResult<PresignResponse, unknown, string, unknown> {
  return useMutation({
    mutationFn: (contentType: string) =>
      api.post<PresignResponse>('/upload/presign', { contentType }),
  });
}

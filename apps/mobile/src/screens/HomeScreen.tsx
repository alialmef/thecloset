import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useFeed } from '../hooks/use-api';
import { Avatar } from '../components/Avatar';
import { LoadingState, EmptyState, ErrorState } from '../components/States';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { Item } from '@closet/shared';

interface FeedItem {
  id: string;
  type: string;
  createdAt: string;
  actor: { id: string; name: string; avatarUrl: string | null };
  data: {
    recipient?: { id: string; name: string; avatarUrl: string | null };
    note?: string;
    items?: Array<{ id: string; imageUrl: string; category: string; brand?: string | null }>;
  };
}

export function HomeScreen(): React.JSX.Element {
  const feedQuery = useFeed();
  const feedItems = (feedQuery.data as { items: FeedItem[] } | undefined)?.items ?? [];

  if (feedQuery.isLoading) return <LoadingState />;
  if (feedQuery.isError) return <ErrorState onRetry={() => feedQuery.refetch()} />;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={feedItems}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={feedQuery.isFetching}
          onRefresh={() => feedQuery.refetch()}
          tintColor={colors.primary}
        />
      }
      renderItem={({ item }) => <FeedCard item={item} />}
      ListEmptyComponent={
        <EmptyState
          title="Your feed is quiet"
          message="Join a group and start styling outfits — your friends' activity will show up here."
        />
      }
    />
  );
}

function FeedCard({ item }: { item: FeedItem }): React.JSX.Element {
  const recipientName = item.data.recipient?.name ?? 'themselves';
  const itemCount = item.data.items?.length ?? 0;

  return (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.cardHeader}>
        <Avatar uri={item.actor.avatarUrl} name={item.actor.name} size={36} />
        <View style={styles.cardHeaderText}>
          <Text style={styles.actorName}>{item.actor.name}</Text>
          <Text style={styles.cardAction}>
            styled an outfit for {recipientName}
          </Text>
        </View>
      </View>

      {item.data.note && <Text style={styles.note}>"{item.data.note}"</Text>}

      {item.data.items && item.data.items.length > 0 && (
        <View style={styles.itemPills}>
          {item.data.items.map((piece) => (
            <View key={piece.id} style={styles.itemPill}>
              <Text style={styles.itemPillText}>
                {piece.brand ?? piece.category}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.timestamp}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundSecondary },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxxl },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeaderText: { flex: 1 },
  actorName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.gray900,
  },
  cardAction: {
    fontSize: typography.size.sm,
    color: colors.gray500,
  },
  note: {
    fontSize: typography.size.md,
    color: colors.gray700,
    fontStyle: 'italic',
    marginBottom: spacing.md,
    lineHeight: typography.size.md * typography.lineHeight.relaxed,
  },
  itemPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  itemPill: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  itemPillText: {
    fontSize: typography.size.sm,
    color: colors.gray700,
    fontWeight: typography.weight.medium,
  },
  timestamp: {
    fontSize: typography.size.xs,
    color: colors.gray400,
  },
});

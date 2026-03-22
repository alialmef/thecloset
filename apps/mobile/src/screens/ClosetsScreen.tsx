import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClosetsStackParamList } from '../navigation/AppNavigator';
import { useMyItems, useMyGroups } from '../hooks/use-api';
import { ItemCard } from '../components/ItemCard';
import { Avatar } from '../components/Avatar';
import { LoadingState, EmptyState, ErrorState } from '../components/States';
import { colors, typography, spacing, radius } from '../theme';
import { Item, Group } from '@closet/shared';

type Nav = NativeStackNavigationProp<ClosetsStackParamList, 'ClosetsHome'>;

export function ClosetsScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const itemsQuery = useMyItems();
  const groupsQuery = useMyGroups();

  const items = (itemsQuery.data as { items: Item[] } | undefined)?.items ?? [];
  const groups = (groupsQuery.data as Group[] | undefined) ?? [];

  // Collect unique group members for friend browsing
  const friends: Array<{ id: string; name: string; avatarUrl: string | null }> = [];
  for (const group of groups) {
    const members = (group as Group & { members?: Array<{ user: { id: string; name: string; avatarUrl: string | null } }> }).members ?? [];
    for (const member of members) {
      if (!friends.find((f) => f.id === member.user.id)) {
        friends.push(member.user);
      }
    }
  }

  if (itemsQuery.isLoading) {
    return <LoadingState />;
  }

  if (itemsQuery.isError) {
    return <ErrorState onRetry={() => itemsQuery.refetch()} />;
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={items}
      numColumns={3}
      keyExtractor={(item) => (item as Item).id}
      columnWrapperStyle={styles.row}
      refreshControl={
        <RefreshControl
          refreshing={itemsQuery.isFetching}
          onRefresh={() => itemsQuery.refetch()}
          tintColor={colors.primary}
        />
      }
      ListHeaderComponent={
        <View>
          {/* Friends row */}
          {friends.length > 0 && (
            <View style={styles.friendsSection}>
              <Text style={styles.sectionTitle}>Friends' Closets</Text>
              <FlatList
                horizontal
                data={friends}
                keyExtractor={(f) => f.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.friendsList}
                renderItem={({ item: friend }) => (
                  <TouchableOpacity
                    style={styles.friendChip}
                    onPress={() =>
                      navigation.navigate('FriendCloset', {
                        userId: friend.id,
                        userName: friend.name,
                      })
                    }
                  >
                    <Avatar uri={friend.avatarUrl} name={friend.name} size={36} />
                    <Text style={styles.friendName} numberOfLines={1}>
                      {friend.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* My closet header */}
          <View style={styles.myClosetHeader}>
            <Text style={styles.sectionTitle}>My Closet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddItem')}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <ItemCard
          imageUrl={(item as Item).imageUrl}
          category={(item as Item).category}
          color={(item as Item).color}
          brand={(item as Item).brand}
          status={(item as Item).status}
          onPress={() => navigation.navigate('ItemDetail', { itemId: (item as Item).id })}
        />
      )}
      ListEmptyComponent={
        <EmptyState
          title="Your closet is empty"
          message="Upload your first items to get started. Take a photo or pick from your gallery."
          actionLabel="Add Items"
          onAction={() => navigation.navigate('AddItem')}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxxl,
  },
  row: {
    gap: spacing.sm,
  },
  friendsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  friendsList: {
    gap: spacing.md,
  },
  friendChip: {
    alignItems: 'center',
    gap: spacing.xs,
    width: 64,
  },
  friendName: {
    fontSize: typography.size.xs,
    color: colors.gray600,
    textAlign: 'center',
  },
  myClosetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  addButtonText: {
    color: colors.white,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
});

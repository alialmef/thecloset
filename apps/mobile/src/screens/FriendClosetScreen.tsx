import React from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClosetsStackParamList } from '../navigation/AppNavigator';
import { useUserItems } from '../hooks/use-api';
import { ItemCard } from '../components/ItemCard';
import { LoadingState, EmptyState, ErrorState } from '../components/States';
import { colors, spacing } from '../theme';
import { Item } from '@closet/shared';

type Nav = NativeStackNavigationProp<ClosetsStackParamList, 'FriendCloset'>;

export function FriendClosetScreen(): React.JSX.Element {
  const route = useRoute();
  const navigation = useNavigation<Nav>();
  const { userId } = route.params as { userId: string };

  const itemsQuery = useUserItems(userId);
  const items = (itemsQuery.data as { items: Item[] } | undefined)?.items ?? [];

  if (itemsQuery.isLoading) return <LoadingState />;
  if (itemsQuery.isError) return <ErrorState onRetry={() => itemsQuery.refetch()} />;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={items}
      numColumns={3}
      keyExtractor={(item) => (item as Item).id}
      columnWrapperStyle={styles.row}
      refreshControl={
        <RefreshControl refreshing={itemsQuery.isFetching} onRefresh={() => itemsQuery.refetch()} tintColor={colors.primary} />
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
        <EmptyState title="Nothing here yet" message="This friend hasn't uploaded any items." />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundSecondary },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxxl },
  row: { gap: spacing.sm },
});

import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackRouteProp } from '@react-navigation/native-stack';
import { ClosetsStackParamList } from '../navigation/AppNavigator';
import { useItem, useCreateBorrowRequest } from '../hooks/use-api';
import { useAuthStore } from '../store/auth-store';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { StatusBadge, Badge } from '../components/Badge';
import { LoadingState, ErrorState } from '../components/States';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { Item, ITEM_CATEGORIES_DISPLAY, ITEM_SEASONS_DISPLAY, ITEM_OCCASIONS_DISPLAY } from '@closet/shared';

type Route = NativeStackRouteProp<ClosetsStackParamList, 'ItemDetail'>['route'];

export function ItemDetailScreen(): React.JSX.Element {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { itemId } = route.params as { itemId: string };
  const userId = useAuthStore((s) => s.userId);

  const itemQuery = useItem(itemId);
  const borrowMutation = useCreateBorrowRequest();

  const item = itemQuery.data as (Item & { owner: { id: string; name: string; avatarUrl: string | null } }) | undefined;

  if (itemQuery.isLoading) {
    return <LoadingState />;
  }

  if (itemQuery.isError || !item) {
    return <ErrorState onRetry={() => itemQuery.refetch()} />;
  }

  const isOwner = item.ownerId === userId;
  const isAvailable = item.status === 'AVAILABLE';

  const handleBorrow = (): void => {
    Alert.alert(
      'Request to Borrow',
      `Ask ${item.owner.name} to borrow this item?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'In Person',
          onPress: () =>
            borrowMutation.mutate(
              { itemId: item.id, pickupMethod: 'IN_PERSON' },
              {
                onSuccess: () => {
                  Alert.alert('Request Sent!', `${item.owner.name} will be notified.`);
                  navigation.goBack();
                },
                onError: (err: Error) => Alert.alert('Error', err.message),
              },
            ),
        },
        {
          text: 'Delivery',
          onPress: () =>
            borrowMutation.mutate(
              { itemId: item.id, pickupMethod: 'DELIVERY' },
              {
                onSuccess: () => {
                  Alert.alert('Request Sent!', `${item.owner.name} will be notified.`);
                  navigation.goBack();
                },
                onError: (err: Error) => Alert.alert('Error', err.message),
              },
            ),
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.details}>
        {/* Owner */}
        <View style={styles.ownerRow}>
          <Avatar uri={item.owner.avatarUrl} name={item.owner.name} size={32} />
          <Text style={styles.ownerName}>{isOwner ? 'You' : item.owner.name}</Text>
          <StatusBadge status={item.status} />
        </View>

        {/* Info */}
        <Text style={styles.brand}>{item.brand ?? item.category}</Text>

        <View style={styles.tags}>
          <Badge label={ITEM_CATEGORIES_DISPLAY[item.category] ?? item.category} />
          <Badge label={ITEM_SEASONS_DISPLAY[item.season] ?? item.season} />
          <Badge label={ITEM_OCCASIONS_DISPLAY[item.occasion] ?? item.occasion} />
          <Badge label={item.color} />
        </View>

        {/* Actions */}
        {!isOwner && isAvailable && (
          <Button
            title="Request to Borrow"
            onPress={handleBorrow}
            loading={borrowMutation.isPending}
            size="lg"
            style={styles.borrowButton}
          />
        )}

        {!isOwner && !isAvailable && (
          <View style={styles.unavailableBox}>
            <Text style={styles.unavailableText}>
              This item is currently {item.status.toLowerCase()}.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingBottom: spacing.xxxxl,
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: colors.gray100,
  },
  details: {
    padding: spacing.xl,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  ownerName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.gray700,
    flex: 1,
  },
  brand: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.gray900,
    marginBottom: spacing.lg,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  borrowButton: {
    marginTop: spacing.md,
  },
  unavailableBox: {
    backgroundColor: colors.gray100,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginTop: spacing.md,
  },
  unavailableText: {
    fontSize: typography.size.md,
    color: colors.gray600,
    textAlign: 'center',
  },
});

import React from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityStackParamList } from '../navigation/AppNavigator';
import {
  useLentItems,
  useBorrowedItems,
  useRespondToBorrowRequest,
  useReturnItem,
} from '../hooks/use-api';
import { Avatar } from '../components/Avatar';
import { StatusBadge } from '../components/Badge';
import { Button } from '../components/Button';
import { LoadingState, EmptyState, ErrorState } from '../components/States';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { BorrowRequest, Item } from '@closet/shared';

type Nav = NativeStackNavigationProp<ActivityStackParamList, 'ActivityHome'>;

function alertMutationError(error: unknown): void {
  const message = error instanceof Error ? error.message : 'Something went wrong';
  Alert.alert('Error', message);
}

interface BorrowRequestWithRelations extends BorrowRequest {
  item: Item;
  borrower: { id: string; name: string; avatarUrl: string | null };
  owner: { id: string; name: string; avatarUrl: string | null };
}

export function ActivityScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const lentQuery = useLentItems();
  const borrowedQuery = useBorrowedItems();
  const respondMutation = useRespondToBorrowRequest();
  const returnMutation = useReturnItem();

  const lentItems = (lentQuery.data ?? []) as BorrowRequestWithRelations[];
  const borrowedItems = (borrowedQuery.data ?? []) as BorrowRequestWithRelations[];

  const isLoading = lentQuery.isLoading || borrowedQuery.isLoading;
  const isError = lentQuery.isError || borrowedQuery.isError;

  if (isLoading) return <LoadingState />;
  if (isError)
    return (
      <ErrorState
        onRetry={() => {
          lentQuery.refetch();
          borrowedQuery.refetch();
        }}
      />
    );

  type ActivitySection = { title: string; data: BorrowRequestWithRelations[] };
  const sections: ActivitySection[] = [
    { title: 'Lent Out', data: lentItems },
    { title: 'Borrowed', data: borrowedItems },
  ].filter((s) => s.data.length > 0);

  const handleApprove = (id: string): void => {
    respondMutation.mutate(
      { id, status: 'APPROVED' },
      {
        onError: alertMutationError,
      },
    );
  };

  const handleDecline = (id: string): void => {
    respondMutation.mutate(
      { id, status: 'DECLINED' },
      {
        onError: alertMutationError,
      },
    );
  };

  const handleReturn = (id: string): void => {
    Alert.alert('Return Item', 'Mark this item as returned?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Return',
        onPress: () =>
          returnMutation.mutate(id, {
            onError: alertMutationError,
          }),
      },
    ]);
  };

  return (
    <SectionList
      style={styles.container}
      contentContainerStyle={styles.content}
      sections={sections}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={lentQuery.isFetching || borrowedQuery.isFetching}
          onRefresh={() => {
            lentQuery.refetch();
            borrowedQuery.refetch();
          }}
          tintColor={colors.primary}
        />
      }
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      )}
      renderItem={({ item: request, section }) => (
        <TouchableOpacity
          style={[styles.requestCard, shadows.sm]}
          onPress={() => navigation.navigate('ItemDetail', { itemId: request.item.id })}
        >
          <View style={styles.requestHeader}>
            <Avatar
              uri={
                section.title === 'Lent Out' ? request.borrower.avatarUrl : request.owner.avatarUrl
              }
              name={section.title === 'Lent Out' ? request.borrower.name : request.owner.name}
              size={36}
            />
            <View style={styles.requestInfo}>
              <Text style={styles.requestName}>
                {section.title === 'Lent Out'
                  ? `Lent to ${request.borrower.name}`
                  : `Borrowed from ${request.owner.name}`}
              </Text>
              <Text style={styles.requestItem}>
                {request.item.brand ?? request.item.category} &middot;{' '}
                {request.pickupMethod === 'IN_PERSON' ? 'In Person' : 'Delivery'}
              </Text>
            </View>
            <StatusBadge status={request.status} />
          </View>

          {/* Action buttons */}
          {request.status === 'PENDING' && section.title === 'Lent Out' && (
            <View style={styles.actions}>
              <Button title="Approve" onPress={() => handleApprove(request.id)} size="sm" />
              <Button
                title="Decline"
                onPress={() => handleDecline(request.id)}
                variant="outline"
                size="sm"
              />
            </View>
          )}

          {(request.status === 'APPROVED' || request.status === 'ACTIVE') &&
            section.title === 'Borrowed' && (
              <View style={styles.actions}>
                <Button
                  title="Mark Returned"
                  onPress={() => handleReturn(request.id)}
                  variant="secondary"
                  size="sm"
                />
              </View>
            )}
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <EmptyState
          title="No activity yet"
          message="Borrow requests and lending activity will show up here."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundSecondary },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxxl },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.gray900,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  requestCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  requestInfo: { flex: 1 },
  requestName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.gray900,
  },
  requestItem: {
    fontSize: typography.size.sm,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    justifyContent: 'flex-end',
  },
});

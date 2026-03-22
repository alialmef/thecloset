import React from 'react';
import { View, Text, FlatList, StyleSheet, Share } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useGroup } from '../hooks/use-api';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { LoadingState, ErrorState } from '../components/States';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { Group, GroupRole } from '@closet/shared';

interface GroupMember {
  userId: string;
  role: GroupRole;
  user: { id: string; name: string; avatarUrl: string | null };
}

export function GroupDetailScreen(): React.JSX.Element {
  const route = useRoute();
  const { groupId } = route.params as { groupId: string };
  const groupQuery = useGroup(groupId);

  const group = groupQuery.data as (Group & { members: GroupMember[] }) | undefined;

  if (groupQuery.isLoading) return <LoadingState />;
  if (groupQuery.isError || !group) return <ErrorState onRetry={() => groupQuery.refetch()} />;

  const handleShareInvite = async (): Promise<void> => {
    await Share.share({
      message: `Join my Closet group "${group.name}"! Use invite code: ${group.inviteCode}`,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.groupName}>{group.name}</Text>
        <Text style={styles.memberCount}>
          {group.members.length} / {group.maxMembers} members
        </Text>
      </View>

      <View style={[styles.inviteCard, shadows.sm]}>
        <Text style={styles.inviteLabel}>Invite Code</Text>
        <Text style={styles.inviteCode}>{group.inviteCode}</Text>
        <Button title="Share Invite" onPress={handleShareInvite} variant="outline" size="sm" />
      </View>

      <Text style={styles.sectionTitle}>Members</Text>

      <FlatList
        data={group.members}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <View style={styles.memberRow}>
            <Avatar uri={item.user.avatarUrl} name={item.user.name} size={40} />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{item.user.name}</Text>
              <Text style={styles.memberRole}>{item.role === 'ADMIN' ? 'Admin' : 'Member'}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  groupName: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.gray900,
  },
  memberCount: {
    fontSize: typography.size.md,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  inviteCard: {
    backgroundColor: colors.gray50,
    padding: spacing.xl,
    borderRadius: radius.xl,
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  inviteLabel: {
    fontSize: typography.size.sm,
    color: colors.gray500,
    fontWeight: typography.weight.medium,
  },
  inviteCode: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    letterSpacing: 4,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.gray900,
    marginBottom: spacing.lg,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    color: colors.gray900,
  },
  memberRole: {
    fontSize: typography.size.sm,
    color: colors.gray500,
  },
});

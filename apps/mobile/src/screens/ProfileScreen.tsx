import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/AppNavigator';
import { useAuthStore } from '../store/auth-store';
import { useUserStats, useMyGroups } from '../hooks/use-api';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { colors, typography, spacing, radius, shadows } from '../theme';
import { Group } from '@closet/shared';

type Nav = NativeStackNavigationProp<ProfileStackParamList, 'ProfileHome'>;

export function ProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const { userName, userPhone, clearUser } = useAuthStore();
  const statsQuery = useUserStats();
  const groupsQuery = useMyGroups();

  const stats = statsQuery.data as
    | {
        totalItems: number;
        availableItems: number;
        lentItems: number;
        borrowedItems: number;
        groupCount: number;
        outfitsCreated: number;
      }
    | undefined;

  const groups = (groupsQuery.data ?? []) as Group[];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={statsQuery.isFetching}
          onRefresh={() => {
            statsQuery.refetch();
            groupsQuery.refetch();
          }}
          tintColor={colors.primary}
        />
      }
    >
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <Avatar uri={null} name={userName ?? 'U'} size={72} />
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userPhone}>{userPhone}</Text>
      </View>

      {/* Stats grid */}
      {stats && (
        <View style={[styles.statsGrid, shadows.sm]}>
          <StatItem label="Items" value={stats.totalItems} />
          <StatItem label="Available" value={stats.availableItems} />
          <StatItem label="Lent Out" value={stats.lentItems} />
          <StatItem label="Borrowed" value={stats.borrowedItems} />
          <StatItem label="Groups" value={stats.groupCount} />
          <StatItem label="Outfits" value={stats.outfitsCreated} />
        </View>
      )}

      {/* Groups */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Groups</Text>
          <View style={styles.groupActions}>
            <Button
              title="Join"
              onPress={() => navigation.navigate('JoinGroup')}
              variant="ghost"
              size="sm"
            />
            <Button
              title="+ Create"
              onPress={() => navigation.navigate('CreateGroup')}
              variant="outline"
              size="sm"
            />
          </View>
        </View>

        {groups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={[styles.groupRow, shadows.sm]}
            onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
          >
            <View>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupMeta}>
                {(group as Group & { _count?: { members: number } })._count?.members ?? '?'} members
              </Text>
            </View>
            <Text style={styles.chevron}>&rsaquo;</Text>
          </TouchableOpacity>
        ))}

        {groups.length === 0 && (
          <Text style={styles.noGroups}>
            No groups yet. Create one or join with an invite code.
          </Text>
        )}
      </View>

      {/* Sign out */}
      <Button
        title="Sign Out"
        onPress={clearUser}
        variant="ghost"
        size="md"
        style={styles.signOut}
      />
    </ScrollView>
  );
}

function StatItem({ label, value }: { label: string; value: number }): React.JSX.Element {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundSecondary },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxxl },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    paddingTop: spacing.lg,
  },
  userName: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.gray900,
    marginTop: spacing.md,
  },
  userPhone: {
    fontSize: typography.size.md,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  statItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statValue: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.gray900,
  },
  groupActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  groupRow: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.gray900,
  },
  groupMeta: {
    fontSize: typography.size.sm,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  chevron: {
    fontSize: typography.size.xxl,
    color: colors.gray400,
  },
  noGroups: {
    fontSize: typography.size.md,
    color: colors.gray500,
    textAlign: 'center',
    paddingVertical: spacing.xxl,
  },
  signOut: {
    marginTop: spacing.lg,
  },
});

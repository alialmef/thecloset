import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing, radius } from '../theme';

interface BadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function Badge({
  label,
  color = colors.gray700,
  backgroundColor = colors.gray100,
  style,
}: BadgeProps): React.JSX.Element {
  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

// Pre-built status badges
export function StatusBadge({ status }: { status: string }): React.JSX.Element {
  const config: Record<string, { color: string; bg: string; label: string }> = {
    AVAILABLE: { color: colors.success, bg: colors.successLight, label: 'Available' },
    LENT: { color: colors.warning, bg: colors.warningLight, label: 'Lent' },
    UNAVAILABLE: { color: colors.gray600, bg: colors.gray200, label: 'Unavailable' },
    PENDING: { color: colors.info, bg: colors.infoLight, label: 'Pending' },
    APPROVED: { color: colors.success, bg: colors.successLight, label: 'Approved' },
    DECLINED: { color: colors.error, bg: colors.errorLight, label: 'Declined' },
    ACTIVE: { color: colors.warning, bg: colors.warningLight, label: 'Active' },
    RETURNED: { color: colors.gray600, bg: colors.gray200, label: 'Returned' },
  };

  const { color, bg, label } = config[status] ?? {
    color: colors.gray600,
    bg: colors.gray200,
    label: status,
  };

  return <Badge label={label} color={color} backgroundColor={bg} />;
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
  },
});

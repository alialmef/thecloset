import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

export function StyleScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Outfit Builder</Text>
      <Text style={styles.subtitle}>
        Select a friend, browse their closet, and drag pieces into the outfit slots to create
        the perfect look.
      </Text>
      <View style={styles.slots}>
        <SlotPlaceholder label="Top" />
        <SlotPlaceholder label="Bottom" />
        <SlotPlaceholder label="Shoes" />
        <SlotPlaceholder label="Accessory" />
      </View>
      <Text style={styles.comingSoon}>Full outfit builder coming in Phase 2</Text>
    </View>
  );
}

function SlotPlaceholder({ label }: { label: string }): React.JSX.Element {
  return (
    <View style={styles.slot}>
      <Text style={styles.slotLabel}>{label}</Text>
      <Text style={styles.slotPlus}>+</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.xxl,
    paddingTop: spacing.xxxxl,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.size.md,
    color: colors.gray500,
    lineHeight: typography.size.md * typography.lineHeight.relaxed,
    marginBottom: spacing.xxxl,
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  slot: {
    width: '45%',
    aspectRatio: 0.75,
    backgroundColor: colors.gray50,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.gray200,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.gray500,
    marginBottom: spacing.sm,
  },
  slotPlus: {
    fontSize: 32,
    color: colors.gray300,
  },
  comingSoon: {
    fontSize: typography.size.sm,
    color: colors.gray400,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet, Dimensions } from 'react-native';
import { StatusBadge } from './Badge';
import { colors, typography, spacing, radius, shadows } from '../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface ItemCardProps {
  imageUrl: string;
  category: string;
  color: string;
  brand?: string | null;
  status: string;
  onPress: () => void;
  columns?: number;
}

export function ItemCard({
  imageUrl,
  category,
  brand,
  status,
  onPress,
  columns = 3,
}: ItemCardProps): React.JSX.Element {
  const gap = spacing.sm;
  const padding = spacing.lg;
  const cardWidth = (SCREEN_WIDTH - padding * 2 - gap * (columns - 1)) / columns;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }, shadows.sm]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, { width: cardWidth, height: cardWidth * 1.2 }]}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={1}>
          {brand ?? category}
        </Text>
        <StatusBadge status={status} />
      </View>
    </TouchableOpacity>
  );
}

interface ItemCardLargeProps {
  imageUrl: string;
  category: string;
  color: string;
  brand?: string | null;
  season: string;
  status: string;
  ownerName: string;
  onPress: () => void;
}

export function ItemCardLarge({
  imageUrl,
  category,
  brand,
  season,
  status,
  ownerName,
  onPress,
}: ItemCardLargeProps): React.JSX.Element {
  return (
    <TouchableOpacity style={[styles.cardLarge, shadows.md]} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: imageUrl }} style={styles.imageLarge} resizeMode="cover" />
      <View style={styles.infoLarge}>
        <View>
          <Text style={styles.brandLarge}>{brand ?? category}</Text>
          <Text style={styles.meta}>
            {category} &middot; {season}
          </Text>
          <Text style={styles.owner}>{ownerName}</Text>
        </View>
        <StatusBadge status={status} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Grid card
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  image: {
    backgroundColor: colors.gray100,
  },
  info: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  category: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    color: colors.gray700,
  },

  // Large card
  cardLarge: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  imageLarge: {
    width: '100%',
    height: 240,
    backgroundColor: colors.gray100,
  },
  infoLarge: {
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandLarge: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.gray900,
  },
  meta: {
    fontSize: typography.size.sm,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  owner: {
    fontSize: typography.size.sm,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
});

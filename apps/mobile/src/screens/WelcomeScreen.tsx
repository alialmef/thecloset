import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../components/Button';
import { colors, typography, spacing } from '../theme';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>closet</Text>
        <Text style={styles.tagline}>The Social Wardrobe</Text>
      </View>

      <View style={styles.features}>
        <FeatureRow title="Upload" description="Digitize your wardrobe with AI auto-tagging" />
        <FeatureRow title="Style" description="Put together outfits from your friends' closets" />
        <FeatureRow title="Trade" description="Borrow and lend within your inner circle" />
      </View>

      <View style={styles.bottom}>
        <Button title="Get Started" onPress={onGetStarted} size="lg" />
      </View>
    </View>
  );
}

function FeatureRow({
  title,
  description,
}: {
  title: string;
  description: string;
}): React.JSX.Element {
  return (
    <View style={styles.feature}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.xxl,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: typography.size.display,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: typography.size.lg,
    color: colors.gray500,
    marginTop: spacing.sm,
  },
  features: {
    gap: spacing.xl,
    marginBottom: spacing.xxxxl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.md,
  },
  featureTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.primary,
    width: 60,
  },
  featureDescription: {
    fontSize: typography.size.md,
    color: colors.gray600,
    flex: 1,
  },
  bottom: {
    paddingBottom: spacing.xxl,
  },
});

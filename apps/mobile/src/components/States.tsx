import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from './Button';
import { colors, typography, spacing } from '../theme';

export function LoadingState({ message = 'Loading...' }: { message?: string }): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="outline" size="sm" style={styles.action} />
      )}
    </View>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong',
  onRetry,
}: ErrorStateProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {onRetry && (
        <Button title="Try Again" onPress={onRetry} variant="outline" size="sm" style={styles.action} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  message: {
    fontSize: typography.size.sm,
    color: colors.gray500,
    marginTop: spacing.md,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    fontSize: typography.size.md,
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: typography.size.md * typography.lineHeight.relaxed,
  },
  action: {
    marginTop: spacing.xl,
  },
});

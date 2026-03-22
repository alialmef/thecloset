import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuthStore } from '../store/auth-store';
import { api } from '../services/api';
import { colors, typography, spacing } from '../theme';
import { User } from '@closet/shared';

interface SignUpScreenProps {
  onBack: () => void;
}

export function SignUpScreen({ onBack }: SignUpScreenProps): React.JSX.Element {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const handleSignUp = async (): Promise<void> => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Missing Info', 'Please enter your name and phone number.');
      return;
    }

    setLoading(true);
    try {
      // Create the user
      const user = await api.post<User>('/users', {
        name: name.trim(),
        phone: phone.trim(),
      });

      // Set auth state (in dev mode, uses user ID as token)
      setUser(user.id, user.name, user.phone);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      Alert.alert('Sign Up Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Button title="Back" onPress={onBack} variant="ghost" size="sm" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Join your friends on Closet and start sharing your wardrobe.
        </Text>

        <Input
          label="Name"
          placeholder="What should friends call you?"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <Input
          label="Phone"
          placeholder="+1 (555) 123-4567"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          returnKeyType="done"
        />

        <Button
          title="Create Account"
          onPress={handleSignUp}
          loading={loading}
          disabled={!name.trim() || !phone.trim()}
          size="lg"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: spacing.xxxxl + spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
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
    marginBottom: spacing.xxxl,
    lineHeight: typography.size.md * typography.lineHeight.relaxed,
  },
});

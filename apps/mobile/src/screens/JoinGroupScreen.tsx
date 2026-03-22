import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useJoinGroup } from '../hooks/use-api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, typography, spacing } from '../theme';

export function JoinGroupScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const joinGroup = useJoinGroup();
  const [code, setCode] = useState('');

  const handleJoin = (): void => {
    if (code.trim().length !== 8) {
      Alert.alert('Invalid Code', 'Invite codes are 8 characters long.');
      return;
    }

    joinGroup.mutate(code.trim().toUpperCase(), {
      onSuccess: () => {
        Alert.alert('Joined!', 'You are now a member of this group.');
        navigation.goBack();
      },
      onError: (err: Error) => Alert.alert('Error', err.message),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join a group</Text>
      <Text style={styles.subtitle}>
        Enter the 8-character invite code your friend shared with you.
      </Text>

      <Input
        label="Invite Code"
        placeholder="e.g. A1B2C3D4"
        value={code}
        onChangeText={setCode}
        autoCapitalize="characters"
        maxLength={8}
        autoFocus
      />

      <Button
        title="Join Group"
        onPress={handleJoin}
        loading={joinGroup.isPending}
        disabled={code.trim().length !== 8}
        size="lg"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.xxl,
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

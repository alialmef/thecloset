import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCreateGroup } from '../hooks/use-api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, typography, spacing } from '../theme';

export function CreateGroupScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const createGroup = useCreateGroup();
  const [name, setName] = useState('');

  const handleCreate = (): void => {
    if (!name.trim()) return;

    createGroup.mutate(name.trim(), {
      onSuccess: () => {
        Alert.alert('Group Created!', 'Share the invite code with your friends.');
        navigation.goBack();
      },
      onError: (err: Error) => Alert.alert('Error', err.message),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Name your group</Text>
      <Text style={styles.subtitle}>
        Pick a name your friends will recognize. You can always change it later.
      </Text>

      <Input
        label="Group Name"
        placeholder='e.g. "The Crew", "NYC Girlies"'
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <Button
        title="Create Group"
        onPress={handleCreate}
        loading={createGroup.isPending}
        disabled={!name.trim()}
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

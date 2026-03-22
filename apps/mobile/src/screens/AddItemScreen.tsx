import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useCreateItem, usePresignUpload } from '../hooks/use-api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, typography, spacing, radius, shadows } from '../theme';
import {
  ITEM_CATEGORIES_DISPLAY,
  ITEM_SEASONS_DISPLAY,
  ITEM_OCCASIONS_DISPLAY,
} from '@closet/shared';

const CATEGORIES = Object.entries(ITEM_CATEGORIES_DISPLAY);
const SEASONS = Object.entries(ITEM_SEASONS_DISPLAY);
const OCCASIONS = Object.entries(ITEM_OCCASIONS_DISPLAY);

export function AddItemScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const createItem = useCreateItem();
  const presign = usePresignUpload();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('TOP');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [season, setSeason] = useState<string>('ALL_SEASON');
  const [occasion, setOccasion] = useState<string>('CASUAL');
  const [saving, setSaving] = useState(false);

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async (): Promise<void> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!imageUri) {
      Alert.alert('Missing Photo', 'Please add a photo of the item.');
      return;
    }
    if (!color.trim()) {
      Alert.alert('Missing Color', 'Please enter the item color.');
      return;
    }

    setSaving(true);
    try {
      // Get presigned URL
      const upload = await presign.mutateAsync('image/jpeg');

      // TODO: In production, actually upload the image to the presigned URL
      // For now, use the public URL directly
      const imageUrl = upload.publicUrl;

      await createItem.mutateAsync({
        imageUrl,
        category,
        color: color.trim(),
        season,
        occasion,
        brand: brand.trim() || undefined,
      });

      Alert.alert('Item Added!', 'Your item has been added to your closet.');
      navigation.goBack();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Image picker */}
      <TouchableOpacity
        style={[styles.imagePicker, shadows.sm]}
        onPress={() =>
          Alert.alert('Add Photo', 'Choose a source', [
            { text: 'Camera', onPress: takePhoto },
            { text: 'Gallery', onPress: pickImage },
            { text: 'Cancel', style: 'cancel' },
          ])
        }
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderIcon}>+</Text>
            <Text style={styles.imagePlaceholderText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Category selector */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.chipRow}>
        {CATEGORIES.map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.chip, category === key && styles.chipSelected]}
            onPress={() => setCategory(key)}
          >
            <Text style={[styles.chipText, category === key && styles.chipTextSelected]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Color */}
      <Input label="Color" placeholder="e.g. Navy Blue" value={color} onChangeText={setColor} />

      {/* Brand (optional) */}
      <Input label="Brand (optional)" placeholder="e.g. Nike, Zara" value={brand} onChangeText={setBrand} />

      {/* Season selector */}
      <Text style={styles.label}>Season</Text>
      <View style={styles.chipRow}>
        {SEASONS.map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.chip, season === key && styles.chipSelected]}
            onPress={() => setSeason(key)}
          >
            <Text style={[styles.chipText, season === key && styles.chipTextSelected]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Occasion selector */}
      <Text style={styles.label}>Occasion</Text>
      <View style={styles.chipRow}>
        {OCCASIONS.map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.chip, occasion === key && styles.chipSelected]}
            onPress={() => setOccasion(key)}
          >
            <Text style={[styles.chipText, occasion === key && styles.chipTextSelected]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Add to Closet"
        onPress={handleSave}
        loading={saving}
        disabled={!imageUri || !color.trim()}
        size="lg"
        style={styles.saveButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxxl,
  },
  imagePicker: {
    width: '100%',
    height: 300,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.gray100,
    marginBottom: spacing.xxl,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderIcon: {
    fontSize: 48,
    color: colors.gray400,
    marginBottom: spacing.sm,
  },
  imagePlaceholderText: {
    fontSize: typography.size.md,
    color: colors.gray500,
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.gray100,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.gray700,
  },
  chipTextSelected: {
    color: colors.white,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});

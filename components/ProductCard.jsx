import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../hooks/useAppTheme';
import { AppButton } from './ui/AppButton';
import { AppText } from './ui/AppText';
import { Card } from './ui/Card';

export function ProductCard({ product, onPress, onAdd, compact }) {
  const { colors } = useAppTheme();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1, flex: compact ? 0.48 : 1 })}>
      <Card style={[styles.card, { padding: 20 }]}>
        <Image source={{ uri: product.images[0] }} style={[styles.image, compact && styles.imageCompact]} />
        <View style={styles.topRow}>
          <AppText variant="caption" weight="800" style={{ color: colors.primary }}>
            {product.category}
          </AppText>
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color={colors.warning} />
            <AppText variant="caption" weight="700">
              {product.rating}
            </AppText>
          </View>
        </View>
        <AppText variant="h3" weight="800" numberOfLines={2}>
          {product.name}
        </AppText>
        <AppText numberOfLines={2} style={{ color: colors.textMuted }}>
          {product.description}
        </AppText>
        <View style={styles.bottomRow}>
          <View>
            <AppText variant="caption" style={{ color: colors.textMuted }}>
              Starting at
            </AppText>
            <AppText variant="h2" weight="800">
              ${product.price}
            </AppText>
          </View>
          <AppButton
            label="Add"
            onPress={onAdd}
            style={[styles.addButton, compact && { paddingHorizontal: 12 }]}
          />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: 14, height: '100%' },
  image: { width: '100%', height: 168, borderRadius: 20 },
  imageCompact: { height: 124 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  addButton: { minHeight: 40, paddingHorizontal: 22, borderRadius: 12 },
});

import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { AppButton } from '../../../components/ui/AppButton';
import { AppText } from '../../../components/ui/AppText';
import { Card } from '../../../components/ui/Card';
import { Screen } from '../../../components/ui/Screen';
import { Toast } from '../../../components/ui/Toast';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { state, actions } = useApp();
  const { colors } = useAppTheme();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const product = state.products.find((item) => item.id === id);

  if (!product) return null;

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.surface }]}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
          <AppText variant="caption" weight="800" style={{ color: colors.primary }}>
            {product.category}
          </AppText>
        </View>
        <AppText variant="hero" weight="900">
          {product.name}
        </AppText>
        <AppText style={{ color: colors.textMuted }}>{product.description}</AppText>
      </View>
      <Card>
        <View style={styles.metrics}>
          <View>
            <AppText variant="caption" style={{ color: colors.textMuted }}>
              Price
            </AppText>
            <AppText variant="h1" weight="900">
              ${product.price}
            </AppText>
          </View>
          <View>
            <AppText variant="caption" style={{ color: colors.textMuted }}>
              Delivery
            </AppText>
            <AppText variant="h3" weight="800">
              {product.deliveryTime}
            </AppText>
          </View>
          <View>
            <AppText variant="caption" style={{ color: colors.textMuted }}>
              Rating
            </AppText>
            <AppText variant="h3" weight="800">
              {product.rating}
            </AppText>
          </View>
        </View>
      </Card>
      <Card>
        <AppText variant="h3" weight="800">
          What’s included
        </AppText>
        {['Strategy call', 'Editable source files', 'Responsive deliverables', 'Support after delivery'].map((item) => (
          <View key={item} style={styles.included}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <AppText>{item}</AppText>
          </View>
        ))}
      </Card>
      <View style={styles.actions}>
        <AppButton
          label="Add to Cart"
          onPress={() => {
            actions.addToCart(product.id);
            setToast({ visible: true, message: 'Added to cart', type: 'success' });
          }}
          style={{ flex: 1 }}
        />
        <AppButton
          label="Buy Now"
          variant="secondary"
          onPress={() => {
            actions.addToCart(product.id);
            router.push('/(app)/cart');
          }}
          style={{ flex: 1 }}
        />
      </View>
      <Toast {...toast} onHide={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: 260, borderRadius: 28 },
  header: { gap: 10 },
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  metrics: { flexDirection: 'row', justifyContent: 'space-between' },
  included: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  actions: { flexDirection: 'row', gap: 12 },
});

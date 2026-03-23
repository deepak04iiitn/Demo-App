import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppInput } from '../../components/forms/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Screen } from '../../components/ui/Screen';
import { Toast } from '../../components/ui/Toast';
import { useApp } from '../../context/AppContext';
import { useAppTheme } from '../../hooks/useAppTheme';

export default function CartScreen() {
  const { cartSummary, actions } = useApp();
  const { colors } = useAppTheme();
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const applyCoupon = async () => {
    try {
      setLoading(true);
      const result = await actions.applyCoupon(coupon);
      setToast({ visible: true, message: result.message, type: 'success' });
    } catch (error) {
      setToast({ visible: true, message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="close" size={20} color={colors.text} />
        </Pressable>
        <AppText variant="h1" weight="900">
          Cart
        </AppText>
      </View>

      {!cartSummary.items.length ? (
        <EmptyState
          title="Your cart is empty"
          description="Add a few services from the catalog to unlock the checkout flow."
          actionLabel="Browse Services"
          onAction={() => router.replace('/(app)/(tabs)/catalog')}
        />
      ) : (
        <>
          {cartSummary.items.map((item) => (
            <Card key={item.productId}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <AppText variant="h3" weight="800">
                    {item.product.name}
                  </AppText>
                  <AppText style={{ color: colors.textMuted }}>${item.product.price} each</AppText>
                </View>
                <Pressable onPress={() => actions.removeFromCart(item.productId)}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </Pressable>
              </View>
              <View style={styles.row}>
                <View style={styles.qty}>
                  <Pressable onPress={() => actions.updateCartItem(item.productId, item.quantity - 1)} style={[styles.qtyButton, { backgroundColor: colors.surfaceAlt }]}>
                    <Ionicons name="remove" size={16} color={colors.text} />
                  </Pressable>
                  <AppText weight="800">{item.quantity}</AppText>
                  <Pressable onPress={() => actions.updateCartItem(item.productId, item.quantity + 1)} style={[styles.qtyButton, { backgroundColor: colors.surfaceAlt }]}>
                    <Ionicons name="add" size={16} color={colors.text} />
                  </Pressable>
                </View>
                <AppText variant="h3" weight="900">
                  ${item.lineTotal}
                </AppText>
              </View>
            </Card>
          ))}

          <Card>
            <AppInput label="Coupon Code" placeholder="Try FLEX20" value={coupon} onChangeText={setCoupon} />
            <AppButton label="Apply Coupon" variant="secondary" loading={loading} onPress={applyCoupon} />
          </Card>

          <Card>
            {[
              ['Subtotal', `$${cartSummary.subtotal}`],
              ['Discount', `-$${cartSummary.discount}`],
              ['Tax', `$${cartSummary.tax}`],
              ['Total', `$${cartSummary.total}`],
            ].map(([label, value]) => (
              <View key={label} style={styles.row}>
                <AppText style={{ color: colors.textMuted }}>{label}</AppText>
                <AppText weight="800">{value}</AppText>
              </View>
            ))}
          </Card>

          <AppButton label="Proceed to Checkout" onPress={() => router.push('/(app)/checkout/address')} />
        </>
      )}
      <Toast {...toast} onHide={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyButton: { width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});

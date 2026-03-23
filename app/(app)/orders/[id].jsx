import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { AppButton } from '../../../components/ui/AppButton';
import { AppText } from '../../../components/ui/AppText';
import { Card } from '../../../components/ui/Card';
import { OrderTimeline } from '../../../components/OrderTimeline';
import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const { state, actions } = useApp();
  const { colors } = useAppTheme();
  const order = state.orders.find((item) => item.id === id);

  if (!order) return null;

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.surfaceAlt }]}>
        <Ionicons name="arrow-back" size={18} color={colors.text} />
      </Pressable>
      <AppText variant="hero" weight="900">
        Order {order.id}
      </AppText>
      <Card>
        <OrderTimeline status={order.status === 'Cancelled' ? 'Placed' : order.status} />
        <AppText style={{ color: colors.textMuted }}>Status: {order.status}</AppText>
      </Card>
      <Card>
        <AppText variant="h3" weight="800">
          Delivery
        </AppText>
        <AppText style={{ color: colors.textMuted }}>{order.address}</AppText>
        <AppText style={{ color: colors.textMuted }}>Paid via {order.paymentMethod}</AppText>
      </Card>
      <Card>
        <AppText variant="h3" weight="800">
          Items
        </AppText>
        {order.items.map((item) => {
          const product = state.products.find((entry) => entry.id === item.productId);
          return (
            <View key={item.productId} style={styles.row}>
              <AppText>{product?.name ?? item.productId}</AppText>
              <AppText weight="800">
                {item.quantity} x ${item.price}
              </AppText>
            </View>
          );
        })}
      </Card>
      {['Placed', 'Shipped'].includes(order.status) ? <AppButton label="Cancel Order" variant="danger" onPress={() => actions.cancelOrder(order.id)} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
});

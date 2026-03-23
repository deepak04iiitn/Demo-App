import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Screen } from '../../../components/ui/Screen';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { AppButton } from '../../../components/ui/AppButton';
import { AppText } from '../../../components/ui/AppText';
import { OrderTimeline } from '../../../components/OrderTimeline';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function OrdersScreen() {
  const { state, actions } = useApp();
  const { colors } = useAppTheme();

  return (
    <Screen>
      <SectionHeader title="Order History" caption="Track progress, inspect details, or cancel active orders." />
      {!state.orders.length ? (
        <EmptyState title="No orders yet" description="Complete a checkout to populate this area with realistic mock history." />
      ) : (
        state.orders.map((order) => (
          <Pressable key={order.id} onPress={() => router.push(`/(app)/orders/${order.id}`)}>
            <Card>
              <View style={styles.row}>
                <View>
                  <AppText variant="h3" weight="800">
                    {order.id}
                  </AppText>
                  <AppText style={{ color: colors.textMuted }}>{order.createdAt}</AppText>
                </View>
                <AppText weight="800">${order.total}</AppText>
              </View>
              <OrderTimeline status={order.status === 'Cancelled' ? 'Placed' : order.status} />
              <View style={styles.row}>
                <AppText weight="700" style={{ color: colors.primary }}>
                  {order.status}
                </AppText>
                {['Placed', 'Shipped'].includes(order.status) ? <AppButton label="Cancel" variant="ghost" onPress={() => actions.cancelOrder(order.id)} /> : null}
              </View>
            </Card>
          </Pressable>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 } });

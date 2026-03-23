import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppText } from '../../../components/ui/AppText';
import { Card } from '../../../components/ui/Card';
import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

const statuses = ['Placed', 'Shipped', 'Delivered'];

export default function AdminOrdersScreen() {
  const { state, actions } = useApp();
  const { colors } = useAppTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="arrow-back" size={18} color={colors.text} />
        </Pressable>
        <AppText variant="h1" weight="900">
          Manage Orders
        </AppText>
      </View>
      {state.orders.map((order) => (
        <Card key={order.id}>
          <View style={styles.row}>
            <View>
              <AppText variant="h3" weight="800">
                {order.id}
              </AppText>
              <AppText style={{ color: colors.textMuted }}>${order.total}</AppText>
            </View>
            <AppText weight="800" style={{ color: colors.primary }}>
              {order.status}
            </AppText>
          </View>
          <View style={styles.statusRow}>
            {statuses.map((status) => (
              <Pressable
                key={status}
                onPress={() => actions.updateOrderStatus(order.id, status)}
                style={[styles.statusChip, { backgroundColor: order.status === status ? colors.primary : colors.surfaceAlt }]}>
                <AppText weight="700" style={{ color: order.status === status ? '#fff' : colors.text }}>
                  {status}
                </AppText>
              </Pressable>
            ))}
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusChip: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 999 },
});

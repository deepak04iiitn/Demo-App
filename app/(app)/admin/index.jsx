import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppText } from '../../../components/ui/AppText';
import { Card } from '../../../components/ui/Card';
import { Screen } from '../../../components/ui/Screen';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function AdminDashboardScreen() {
  const { state } = useApp();
  const { colors } = useAppTheme();
  const revenue = state.orders.reduce((sum, order) => sum + order.total, 0);

  const cards = [
    { label: 'Revenue', value: `$${revenue.toFixed(0)}` },
    { label: 'Users', value: state.users.length },
    { label: 'Orders', value: state.orders.length },
  ];

  const links = [
    ['Manage Products', '/(app)/admin/products', 'grid-outline'],
    ['Manage Orders', '/(app)/admin/orders', 'cube-outline'],
    ['Manage Users', '/(app)/admin/users', 'people-outline'],
  ];

  return (
    <Screen>
      <SectionHeader title="Admin Panel" caption={`Role-based mode: ${state.role.toUpperCase()}`} />
      <View style={styles.grid}>
        {cards.map((item) => (
          <Card key={item.label} style={styles.metric}>
            <AppText variant="caption" style={{ color: colors.textMuted }}>
              {item.label}
            </AppText>
            <AppText variant="h1" weight="900">
              {item.value}
            </AppText>
          </Card>
        ))}
      </View>
      {links.map(([label, path, icon]) => (
        <Pressable key={label} onPress={() => router.push(path)}>
          <Card style={styles.link}>
            <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name={icon} size={18} color={colors.primary} />
            </View>
            <AppText variant="h3" weight="800" style={{ flex: 1 }}>
              {label}
            </AppText>
            <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metric: { width: '48%' },
  link: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});

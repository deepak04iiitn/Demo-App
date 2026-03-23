import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Card } from '../../../components/ui/Card';
import { Screen } from '../../../components/ui/Screen';
import { AppText } from '../../../components/ui/AppText';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { quickActions } from '../../../data/mockData';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function HomeScreen() {
  const { state, cartSummary } = useApp();
  const { colors } = useAppTheme();

  const stats = [
    { label: 'Active Orders', value: state.orders.filter((order) => order.status !== 'Delivered').length },
    { label: 'Saved Services', value: state.products.filter((item) => item.tags.includes('featured')).length },
    { label: 'Cart Total', value: `$${cartSummary.total}` },
  ];

  const handleAction = (id) => {
    if (id === 'browse') router.push('/(app)/(tabs)/catalog');
    if (id === 'cart') router.push('/(app)/cart');
    if (id === 'orders') router.push('/(app)/(tabs)/orders');
    if (id === 'admin') router.push('/(app)/admin/index');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <AppText variant="caption" weight="800" style={{ color: colors.primary }}>
            {state.language}
          </AppText>
          <AppText variant="hero" weight="900">
            Hi, {state.user.name.split(' ')[0]}
          </AppText>
          <AppText style={{ color: colors.textMuted }}>
            Ready to manage clients, services, and storefront activity?
          </AppText>
        </View>
        <Pressable onPress={() => router.push('/(app)/settings')} style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
          <AppText variant="h3" weight="800" style={{ color: colors.primary }}>
            {state.user.name.charAt(0)}
          </AppText>
        </Pressable>
      </View>

      <Card style={[styles.heroCard, { backgroundColor: colors.primary, borderColor: 'transparent' }]}>
        <AppText variant="caption" weight="800" style={{ color: '#dbe8ff' }}>
          DASHBOARD
        </AppText>
        <AppText variant="h1" weight="900" style={{ color: '#fff' }}>
          Track work, revenue, and customer momentum in one place.
        </AppText>
        <View style={styles.heroMeta}>
          <View>
            <AppText variant="caption" style={{ color: '#dbe8ff' }}>
              This Month
            </AppText>
            <AppText variant="h2" weight="900" style={{ color: '#fff' }}>
              $4,860
            </AppText>
          </View>
          <View>
            <AppText variant="caption" style={{ color: '#dbe8ff' }}>
              Conversion
            </AppText>
            <AppText variant="h2" weight="900" style={{ color: '#fff' }}>
              24%
            </AppText>
          </View>
        </View>
      </Card>

      <SectionHeader title="Quick actions" caption="Fast links into the flows recruiters usually inspect." />
      <View style={styles.actionGrid}>
        {quickActions.map((item) => (
          <Pressable key={item.id} onPress={() => handleAction(item.id)} style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name={item.icon} size={22} color={colors.primary} />
            <AppText weight="800">{item.label}</AppText>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Activity snapshot" caption="Recent momentum across your dummy marketplace." />
      <View style={styles.stats}>
        {stats.map((stat) => (
          <Card key={stat.label} style={styles.statCard}>
            <AppText variant="caption" style={{ color: colors.textMuted }}>
              {stat.label}
            </AppText>
            <AppText variant="h2" weight="900">
              {stat.value}
            </AppText>
          </Card>
        ))}
      </View>

      <SectionHeader title="Categories" caption="Explore high-intent service buckets." />
      <View style={styles.categoryWrap}>
        {state.categories.map((category) => (
          <Pressable key={category} onPress={() => router.push('/(app)/(tabs)/catalog')} style={[styles.categoryChip, { backgroundColor: colors.surfaceAlt }]}>
            <AppText weight="700">{category}</AppText>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatar: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  heroCard: { gap: 18 },
  heroMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '48%', minHeight: 100, borderWidth: 1, borderRadius: 24, padding: 16, gap: 10 },
  stats: { gap: 12 },
  statCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 999 },
});

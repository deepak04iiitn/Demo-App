import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppText } from '../../../components/ui/AppText';
import { quickActions } from '../../../data/mockData';
import { useApp } from '../../../context/AppContext';
import { Screen } from '../../../components/ui/Screen';

// ── Brand tokens ──────────────────────────────────────
const C = {
  bg:           '#F5F5F0',   // warm off-white canvas
  surface:      '#FFFFFF',   // card surface
  accentSoft:   '#ECEAFF',   // near-white indigo tint
  accent:       '#5B54E8',   // indigo accent
  text:         '#1A1A2E',   // deep navy text
  textMid:      '#6B6B8A',   // mid text
  textLight:    '#A8A8C0',   // light label
  border:       '#E8E8E2',   // warm border
  borderAccent: '#C8C5F5',   // indigo border
  green:        '#22C55E',
};

export default function HomeScreen() {
  const { state, cartSummary } = useApp();

  const stats = [
    { label: 'Active Orders',  value: state.orders.filter((o) => o.status !== 'Delivered').length, icon: 'cube-outline' },
    { label: 'Saved Services', value: state.products.filter((p) => p.tags.includes('featured')).length, icon: 'bookmark-outline' },
    { label: 'Cart Total',     value: `$${cartSummary.total}`, icon: 'cart-outline' },
  ];

  const handleAction = (id) => {
    if (id === 'browse') router.push('/(app)/(tabs)/catalog');
    if (id === 'cart')   router.push('/(app)/cart');
    if (id === 'orders') router.push('/(app)/(tabs)/orders');
    if (id === 'admin')  router.push('/(app)/admin/index');
  };

  const firstName = state.user.name.split(' ')[0];
  const initial   = state.user.name.charAt(0);

  return (
    <Screen showHeader>
      {/* ── Page header ── */}
      <View style={s.pageHeader}>
        <View>
          <AppText weight="900" style={s.pageTitle}>Hi, {firstName} 👋</AppText>
          <View style={s.greetRow}>
            <View style={s.greetDot} />
            <AppText style={s.pageSubtitle}>Good morning</AppText>
          </View>
        </View>
      </View>

      {/* ── Hero card ── */}
      <View style={s.heroCard}>
        <View style={s.heroTop}>
          <View style={s.heroPill}>
            <View style={s.heroPillDot} />
            <AppText style={s.heroPillText}>DASHBOARD</AppText>
          </View>
          <View style={s.heroIconBox}>
            <Ionicons name="trending-up" size={15} color={C.accent} />
          </View>
        </View>

        <AppText weight="900" style={s.heroTitle}>
          Track work,{'\n'}revenue &amp;{'\n'}momentum.
        </AppText>

        <View style={s.heroDivider} />

        <View style={s.heroStats}>
          {[
            { label: 'This Month', value: '$4,860' },
            { label: 'Conversion', value: '24%' },
            { label: 'Orders',     value: state.orders.length },
          ].map((item, i) => (
            <View key={item.label} style={[s.heroStat, i < 2 && s.heroStatBorder]}>
              <AppText style={s.heroStatLabel}>{item.label}</AppText>
              <AppText weight="900" style={s.heroStatValue}>{item.value}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* ── Activity snapshot ── */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <View style={s.sectionTitleRow}>
            <View style={s.sectionBar} />
            <AppText weight="800" style={s.sectionTitle}>Activity</AppText>
          </View>
          <AppText style={s.sectionSub}>Live snapshot</AppText>
        </View>
        <View style={s.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={s.statCard}>
              <View style={s.statIconWrap}>
                <Ionicons name={stat.icon} size={14} color={C.accent} />
              </View>
              <AppText weight="900" style={s.statValue}>{stat.value}</AppText>
              <AppText style={s.statLabel}>{stat.label}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* ── Quick actions ── */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <View style={s.sectionTitleRow}>
            <View style={s.sectionBar} />
            <AppText weight="800" style={s.sectionTitle}>Quick Actions</AppText>
          </View>
          <AppText style={s.sectionSub}>Jump into a flow</AppText>
        </View>
        <View style={s.actionGrid}>
          {quickActions.map((item, i) => (
            <Pressable
              key={item.id}
              onPress={() => handleAction(item.id)}
              style={({ pressed }) => [
                s.actionCard,
                i === 0 && s.actionCardPrimary,
                pressed && (i === 0 ? s.actionCardPrimaryPressed : s.actionCardPressed),
              ]}
            >
              <View style={[s.actionIconWrap, i === 0 && s.actionIconWrapPrimary]}>
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={i === 0 ? C.accent : C.textMid}
                />
              </View>
              <AppText weight="700" style={[s.actionLabel, i === 0 && s.actionLabelPrimary]}>
                {item.label}
              </AppText>
              <View style={[s.actionChevron, i === 0 && s.actionChevronPrimary]}>
                <Ionicons
                  name="chevron-forward"
                  size={13}
                  color={i === 0 ? C.accent : C.textLight}
                />
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Categories ── */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <View style={s.sectionTitleRow}>
            <View style={s.sectionBar} />
            <AppText weight="800" style={s.sectionTitle}>Categories</AppText>
          </View>
          <AppText style={s.sectionSub}>Browse by type</AppText>
        </View>
        <View style={s.categoryWrap}>
          {state.categories.map((cat, i) => (
            <Pressable
              key={cat}
              onPress={() => router.push('/(app)/(tabs)/catalog')}
              style={({ pressed }) => [
                s.categoryChip,
                i === 0 && s.categoryChipActive,
                pressed && !i && s.categoryChipActivePressed,
                pressed && !!i && s.categoryChipPressed,
              ]}
            >
              <AppText weight="600" style={[s.categoryChipText, i === 0 && s.categoryChipTextActive]}>
                {cat}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ height: 8 }} />
    </Screen>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { gap: 30, paddingBottom: 48 },

  // ── Page header ─────────────────────────────────────
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingBottom: 4,
  },
  pageTitle:    { fontSize: 30, color: C.text, letterSpacing: -1, lineHeight: 33 },
  pageSubtitle: { fontSize: 13, color: C.textLight, marginTop: 3 },
  greetRow:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  greetDot:     { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.green },

  // ── Hero card ─────────────────────────────────────────
  heroCard: {
    backgroundColor: C.surface,
    borderRadius: 26,
    padding: 24,
    gap: 18,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 11, paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
  },
  heroPillDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: C.accent },
  heroPillText: { fontSize: 9, letterSpacing: 2.5, color: C.accent, fontWeight: '700' },
  heroIconBox: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { fontSize: 29, lineHeight: 35, color: C.text, letterSpacing: -0.9 },
  heroDivider: { height: 1, backgroundColor: C.border },
  heroStats:      { flexDirection: 'row' },
  heroStat:       { flex: 1, paddingRight: 14, gap: 3 },
  heroStatBorder: { borderRightWidth: 1, borderRightColor: C.border, marginRight: 14 },
  heroStatLabel:  { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.3 },
  heroStatValue:  { fontSize: 21, color: C.text, letterSpacing: -0.7 },

  // ── Section ──────────────────────────────────────────
  section:        { gap: 13 },
  sectionHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitleRow:{ flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionBar:     { width: 3, height: 16, borderRadius: 2, backgroundColor: C.accent },
  sectionTitle:   { fontSize: 16, color: C.text, letterSpacing: -0.4 },
  sectionSub:     { fontSize: 11, color: C.textLight },

  // ── Stats row ────────────────────────────────────────
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, gap: 6,
    borderRadius: 18, padding: 16,
    backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 4,
    elevation: 1,
  },
  statIconWrap: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: C.accentSoft,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 2,
  },
  statValue: { fontSize: 21, color: C.text, letterSpacing: -0.6 },
  statLabel: { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.2 },

  // ── Action grid ──────────────────────────────────────
  actionGrid: { gap: 8 },
  actionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 13,
    borderRadius: 18,
    paddingVertical: 14, paddingHorizontal: 16,
    backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03, shadowRadius: 4,
    elevation: 1,
  },
  actionCardPressed:        { backgroundColor: '#F7F7F3' },
  actionCardPrimary:        { backgroundColor: C.accentSoft, borderColor: C.borderAccent },
  actionCardPrimaryPressed: { backgroundColor: '#DDD9FF' },
  actionIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F0F0EC',
    alignItems: 'center', justifyContent: 'center',
  },
  actionIconWrapPrimary: { backgroundColor: '#FFFFFF' },
  actionLabel:        { flex: 1, fontSize: 14, color: C.text, letterSpacing: -0.2 },
  actionLabelPrimary: { color: C.accent },
  actionChevron: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: '#F0F0EC',
    alignItems: 'center', justifyContent: 'center',
  },
  actionChevronPrimary: { backgroundColor: '#FFFFFF' },

  // ── Categories ───────────────────────────────────────
  categoryWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.surface,
  },
  categoryChipActive:        { backgroundColor: C.accentSoft, borderColor: C.borderAccent },
  categoryChipPressed:       { backgroundColor: '#EEEEE8' },
  categoryChipActivePressed: { backgroundColor: '#DDD9FF' },
  categoryChipText:          { fontSize: 13, color: C.textMid, letterSpacing: -0.1 },
  categoryChipTextActive:    { color: C.accent },
});
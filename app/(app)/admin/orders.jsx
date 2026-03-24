import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppText } from '../../../components/ui/AppText';
import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';

// ── Brand tokens (mirrored from OrdersScreen) ─────────
const C = {
  bg:           '#F5F5F0',
  surface:      '#FFFFFF',
  accentSoft:   '#ECEAFF',
  accent:       '#5B54E8',
  text:         '#1A1A2E',
  textMid:      '#6B6B8A',
  textLight:    '#A8A8C0',
  border:       '#E8E8E2',
  borderAccent: '#C8C5F5',
  green:        '#22C55E',
  greenSoft:    '#DCFCE7',
  amber:        '#F59E0B',
  amberSoft:    '#FEF3C7',
  red:          '#EF4444',
  redSoft:      '#FEE2E2',
  blueSoft:     '#EFF6FF',
  blue:         '#3B82F6',
};

// ── Status config (mirrored from OrdersScreen) ────────
const STATUS = {
  Placed:    { color: C.blue,   bg: C.blueSoft,   icon: 'receipt-outline',          label: 'Order Placed' },
  Confirmed: { color: C.accent, bg: C.accentSoft,  icon: 'checkmark-circle-outline', label: 'Confirmed' },
  Shipped:   { color: C.amber,  bg: C.amberSoft,  icon: 'cube-outline',             label: 'Shipped' },
  Delivered: { color: C.green,  bg: C.greenSoft,  icon: 'bag-check-outline',        label: 'Delivered' },
  Cancelled: { color: C.red,    bg: C.redSoft,    icon: 'close-circle-outline',     label: 'Cancelled' },
};

const ALL_STATUSES = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];

// ── StatusBadge (identical to OrdersScreen) ───────────
function StatusBadge({ status }) {
  const cfg = STATUS[status] || STATUS.Placed;
  return (
    <View style={[badge.wrap, { backgroundColor: cfg.bg }]}>
      <Ionicons name={cfg.icon} size={12} color={cfg.color} />
      <AppText weight="700" style={[badge.text, { color: cfg.color }]}>{cfg.label}</AppText>
    </View>
  );
}

const badge = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  text: { fontSize: 11, letterSpacing: 0.1 },
});

// ── Admin Order Card ───────────────────────────────────
function AdminOrderCard({ order, onUpdateStatus }) {
  const itemCount = order.items?.length ?? 0;

  return (
    <View style={card.wrap}>
      {/* ── Top row: ID + badge ── */}
      <View style={card.topRow}>
        <View style={card.idWrap}>
          <View style={card.idIconBox}>
            <Ionicons name="receipt-outline" size={14} color={C.accent} />
          </View>
          <View>
            <AppText weight="900" style={card.orderId}>{order.id}</AppText>
            <AppText style={card.orderDate}>{order.createdAt}</AppText>
          </View>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <View style={card.divider} />

      {/* ── Total + item count row ── */}
      <View style={card.metaRow}>
        <View>
          <AppText style={card.totalLabel}>Order total</AppText>
          <AppText weight="900" style={card.totalValue}>${order.total}</AppText>
        </View>
        {itemCount > 0 && (
          <View style={card.itemCountBadge}>
            <AppText weight="700" style={card.itemCountText}>{itemCount} item{itemCount !== 1 ? 's' : ''}</AppText>
          </View>
        )}
      </View>

      <View style={card.divider} />

      {/* ── Status update chips ── */}
      <View>
        <AppText style={card.updateLabel}>Update status</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={card.chipsRow}>
          {ALL_STATUSES.map((status) => {
            const cfg = STATUS[status];
            const isActive = order.status === status;
            return (
              <Pressable
                key={status}
                onPress={() => onUpdateStatus(order.id, status)}
                style={[
                  card.chip,
                  { borderColor: isActive ? cfg.color : C.border },
                  isActive && { backgroundColor: cfg.bg },
                ]}
              >
                <Ionicons name={cfg.icon} size={12} color={isActive ? cfg.color : C.textLight} />
                <AppText
                  weight="700"
                  style={[card.chipText, { color: isActive ? cfg.color : C.textMid }]}
                >
                  {status}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const card = StyleSheet.create({
  wrap: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: '#5B54E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },

  // Top
  topRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  idWrap:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  idIconBox: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  orderId:   { fontSize: 14, color: C.text, letterSpacing: -0.3 },
  orderDate: { fontSize: 11, color: C.textLight, marginTop: 1 },

  divider: { height: 1, backgroundColor: C.border },

  // Meta row
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  totalLabel: { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.3, marginBottom: 2 },
  totalValue: { fontSize: 20, color: C.text, letterSpacing: -0.6 },
  itemCountBadge: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
  },
  itemCountText: { fontSize: 11, color: C.textMid },

  // Status chips
  updateLabel: { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.3, marginBottom: 10 },
  chipsRow:    { gap: 8, paddingRight: 4 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1.5,
    backgroundColor: C.surface,
  },
  chipText: { fontSize: 12 },
});

// ── Summary strip ─────────────────────────────────────
function SummaryStrip({ orders }) {
  const active    = orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.status)).length;
  const delivered = orders.filter((o) => o.status === 'Delivered').length;
  const total     = orders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0).toFixed(0);

  const stats = [
    { label: 'Active',    value: active,      icon: 'time-outline',      color: C.accent, bg: C.accentSoft },
    { label: 'Delivered', value: delivered,   icon: 'bag-check-outline', color: C.green,  bg: C.greenSoft },
    { label: 'Revenue',   value: `$${total}`, icon: 'wallet-outline',    color: C.amber,  bg: C.amberSoft },
  ];

  return (
    <View style={strip.wrap}>
      {stats.map((s, i) => (
        <View key={s.label} style={[strip.cell, i < 2 && strip.cellBorder]}>
          <View style={[strip.iconWrap, { backgroundColor: s.bg }]}>
            <Ionicons name={s.icon} size={13} color={s.color} />
          </View>
          <AppText weight="900" style={strip.value}>{s.value}</AppText>
          <AppText style={strip.label}>{s.label}</AppText>
        </View>
      ))}
    </View>
  );
}

const strip = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 22,
    borderWidth: 1.5, borderColor: C.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6,
    elevation: 1,
  },
  cell:       { flex: 1, alignItems: 'center', paddingVertical: 16, gap: 5 },
  cellBorder: { borderRightWidth: 1, borderRightColor: C.border },
  iconWrap:   { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  value:      { fontSize: 18, color: C.text, letterSpacing: -0.5 },
  label:      { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.3 },
});

// ── Main screen ───────────────────────────────────────
export default function AdminOrdersScreen() {
  const { state, actions } = useApp();

  return (
    <Screen>
      {/* ── Page header ── */}
      <View style={s.pageHeader}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={18} color={C.accent} />
        </Pressable>
        <View style={s.titleWrap}>
          <AppText weight="900" style={s.pageTitle}>Manage Orders</AppText>
          <AppText style={s.pageSubtitle}>Update &amp; track all orders</AppText>
        </View>
        {state.orders.length > 0 && (
          <View style={s.orderCountBadge}>
            <AppText weight="800" style={s.orderCountText}>{state.orders.length}</AppText>
          </View>
        )}
      </View>

      {!state.orders.length ? (
        <View style={s.emptyWrap}>
          <View style={s.emptyIconCircle}>
            <Ionicons name="bag-outline" size={30} color={C.accent} />
          </View>
          <AppText weight="800" style={s.emptyTitle}>No orders yet</AppText>
          <AppText style={s.emptyDesc}>Orders placed by customers will appear here.</AppText>
        </View>
      ) : (
        <>
          <SummaryStrip orders={state.orders} />
          {state.orders.map((order) => (
            <AdminOrderCard
              key={order.id}
              order={order}
              onUpdateStatus={actions.updateOrderStatus}
            />
          ))}
        </>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  titleWrap:    { flex: 1 },
  pageTitle:    { fontSize: 30, color: C.text, letterSpacing: -1, lineHeight: 33 },
  pageSubtitle: { fontSize: 13, color: C.textLight, marginTop: 3 },
  orderCountBadge: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  orderCountText: { fontSize: 15, color: C.accent },

  emptyWrap: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40, gap: 12 },
  emptyIconCircle: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 20, color: C.text, letterSpacing: -0.4 },
  emptyDesc:  { fontSize: 13, color: C.textLight, textAlign: 'center', lineHeight: 20 },
});
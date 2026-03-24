import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppText } from '../../../components/ui/AppText';
import { AppButton } from '../../../components/ui/AppButton';
import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';

// ── Brand tokens ──────────────────────────────────────
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

// ── Status config ─────────────────────────────────────
const STATUS = {
  Placed:    { color: C.blue,  bg: C.blueSoft,  icon: 'receipt-outline',      label: 'Order Placed' },
  Confirmed: { color: C.accent,bg: C.accentSoft,icon: 'checkmark-circle-outline', label: 'Confirmed' },
  Shipped:   { color: C.amber, bg: C.amberSoft, icon: 'cube-outline',          label: 'Shipped' },
  Delivered: { color: C.green, bg: C.greenSoft, icon: 'bag-check-outline',     label: 'Delivered' },
  Cancelled: { color: C.red,   bg: C.redSoft,   icon: 'close-circle-outline',  label: 'Cancelled' },
};

const TIMELINE_STEPS = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];

function getStepIndex(status) {
  if (status === 'Cancelled') return -1;
  return TIMELINE_STEPS.indexOf(status);
}

// ── Sub-components ────────────────────────────────────

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

function Timeline({ status }) {
  const currentIdx = getStepIndex(status);
  const cancelled  = status === 'Cancelled';

  return (
    <View style={tl.wrap}>
      {TIMELINE_STEPS.map((step, i) => {
        const done    = !cancelled && i <= currentIdx;
        const current = !cancelled && i === currentIdx;
        const cfg     = STATUS[step];

        return (
          <View key={step} style={tl.stepCol}>
            {/* Connector line */}
            {i < TIMELINE_STEPS.length - 1 && (
              <View style={[tl.line, done && i < currentIdx && tl.lineDone]} />
            )}

            {/* Dot */}
            <View style={[
              tl.dot,
              done  && { backgroundColor: cfg.color, borderColor: cfg.color },
              current && tl.dotCurrent,
              cancelled && tl.dotCancelled,
            ]}>
              {done && !current && (
                <Ionicons name="checkmark" size={9} color="#fff" />
              )}
              {current && !cancelled && (
                <View style={[tl.dotInner, { backgroundColor: cfg.color }]} />
              )}
            </View>

            {/* Label */}
            <AppText
              weight={current ? '800' : '600'}
              style={[tl.label, done && { color: cfg.color }, !done && !cancelled && { color: C.textLight }]}
            >
              {step}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const tl = StyleSheet.create({
  wrap:       { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 4 },
  stepCol:    { flex: 1, alignItems: 'center', position: 'relative' },
  line: {
    position: 'absolute',
    top: 10,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: C.border,
    zIndex: 0,
  },
  lineDone:       { backgroundColor: C.green },
  dot: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: C.border,
    backgroundColor: C.surface,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 1, marginBottom: 6,
  },
  dotCurrent:     { borderColor: C.accent, backgroundColor: C.accentSoft },
  dotCancelled:   { borderColor: C.border, backgroundColor: C.bg },
  dotInner:       { width: 7, height: 7, borderRadius: 4 },
  label:          { fontSize: 10, color: C.textMid, letterSpacing: 0.1, textAlign: 'center' },
});

function OrderCard({ order, onCancel }) {
  const canCancel = ['Placed', 'Confirmed', 'Shipped'].includes(order.status);
  const itemCount = order.items?.length ?? 0;

  return (
    <Pressable
      onPress={() => router.push(`/(app)/orders/${order.id}`)}
      style={({ pressed }) => [card.wrap, pressed && card.wrapPressed]}
    >
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

      {/* ── Timeline ── */}
      {order.status !== 'Cancelled' ? (
        <Timeline status={order.status} />
      ) : (
        <View style={card.cancelledRow}>
          <Ionicons name="ban-outline" size={14} color={C.red} />
          <AppText weight="600" style={card.cancelledText}>This order was cancelled</AppText>
        </View>
      )}

      <View style={card.divider} />

      {/* ── Bottom row: total + item count + CTA ── */}
      <View style={card.bottomRow}>
        <View>
          <AppText style={card.totalLabel}>Order total</AppText>
          <AppText weight="900" style={card.totalValue}>${order.total}</AppText>
        </View>

        {itemCount > 0 && (
          <View style={card.itemCountBadge}>
            <AppText weight="700" style={card.itemCountText}>{itemCount} item{itemCount !== 1 ? 's' : ''}</AppText>
          </View>
        )}

        <View style={card.actions}>
          {canCancel && (
            <Pressable
              onPress={(e) => { e.stopPropagation?.(); onCancel(order.id); }}
              style={card.cancelBtn}
            >
              <AppText weight="700" style={card.cancelBtnText}>Cancel</AppText>
            </Pressable>
          )}
          <View style={card.arrowBtn}>
            <Ionicons name="chevron-forward" size={14} color={C.accent} />
          </View>
        </View>
      </View>
    </Pressable>
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
  wrapPressed: { backgroundColor: '#FAFAF8', transform: [{ scale: 0.99 }] },

  // Top
  topRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  idWrap:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  idIconBox:{
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  orderId:   { fontSize: 14, color: C.text, letterSpacing: -0.3 },
  orderDate: { fontSize: 11, color: C.textLight, marginTop: 1 },

  divider: { height: 1, backgroundColor: C.border },

  // Cancelled
  cancelledRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  cancelledText:{ fontSize: 13, color: C.red },

  // Bottom
  bottomRow:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  totalLabel:   { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.3, marginBottom: 2 },
  totalValue:   { fontSize: 20, color: C.text, letterSpacing: -0.6 },
  itemCountBadge: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
  },
  itemCountText: { fontSize: 11, color: C.textMid },
  actions:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 'auto' },
  cancelBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5, borderColor: C.redSoft,
    backgroundColor: C.redSoft,
  },
  cancelBtnText: { fontSize: 12, color: C.red },
  arrowBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
});

// ── Summary strip ─────────────────────────────────────
function SummaryStrip({ orders }) {
  const active    = orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.status)).length;
  const delivered = orders.filter((o) => o.status === 'Delivered').length;
  const total     = orders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0).toFixed(0);

  const stats = [
    { label: 'Active',    value: active,    icon: 'time-outline',         color: C.accent,  bg: C.accentSoft },
    { label: 'Delivered', value: delivered, icon: 'bag-check-outline',    color: C.green,   bg: C.greenSoft },
    { label: 'Spent',     value: `$${total}`,icon: 'wallet-outline',      color: C.amber,   bg: C.amberSoft },
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

// ── Filter tabs ───────────────────────────────────────
const FILTERS = ['All', 'Active', 'Delivered', 'Cancelled'];

function FilterTabs({ active, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tabs.row}>
      {FILTERS.map((f) => {
        const isActive = f === active;
        return (
          <Pressable
            key={f}
            onPress={() => onChange(f)}
            style={[tabs.chip, isActive && tabs.chipActive]}
          >
            <AppText weight="700" style={[tabs.chipText, isActive && tabs.chipTextActive]}>
              {f}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const tabs = StyleSheet.create({
  row:          { gap: 8, paddingRight: 4 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.surface,
  },
  chipActive:    { backgroundColor: C.accentSoft, borderColor: C.borderAccent },
  chipText:      { fontSize: 13, color: C.textMid },
  chipTextActive:{ color: C.accent },
});

// ── Main screen ───────────────────────────────────────
export default function OrdersScreen() {
  const { state, actions } = useApp();
  const [activeFilter, setActiveFilter] = React.useState('All');

  const filtered = state.orders.filter((o) => {
    if (activeFilter === 'All')       return true;
    if (activeFilter === 'Active')    return !['Delivered', 'Cancelled'].includes(o.status);
    if (activeFilter === 'Delivered') return o.status === 'Delivered';
    if (activeFilter === 'Cancelled') return o.status === 'Cancelled';
    return true;
  });

  return (
    <Screen>
      {/* ── Page header ── */}
      <View style={s.pageHeader}>
        <View>
          <AppText weight="900" style={s.pageTitle}>Orders</AppText>
          <AppText style={s.pageSubtitle}>Track &amp; manage your history</AppText>
        </View>
        {state.orders.length > 0 && (
          <View style={s.orderCountBadge}>
            <AppText weight="800" style={s.orderCountText}>{state.orders.length}</AppText>
          </View>
        )}
      </View>

      {!state.orders.length ? (
        /* ── Empty state ── */
        <View style={s.emptyWrap}>
          <View style={s.emptyIconCircle}>
            <Ionicons name="bag-outline" size={30} color={C.accent} />
          </View>
          <AppText weight="800" style={s.emptyTitle}>No orders yet</AppText>
          <AppText style={s.emptyDesc}>
            Complete a checkout to see your order history here.
          </AppText>
          <Pressable
            onPress={() => router.push('/(app)/(tabs)/catalog')}
            style={s.emptyBtn}
          >
            <Ionicons name="storefront-outline" size={14} color={C.accent} />
            <AppText weight="700" style={s.emptyBtnText}>Browse Services</AppText>
          </Pressable>
        </View>
      ) : (
        <>
          {/* ── Summary strip ── */}
          <SummaryStrip orders={state.orders} />

          {/* ── Filter tabs ── */}
          <FilterTabs active={activeFilter} onChange={setActiveFilter} />

          {/* ── Order cards ── */}
          {filtered.length === 0 ? (
            <View style={s.emptyFilter}>
              <Ionicons name="filter-outline" size={22} color={C.textLight} />
              <AppText style={s.emptyFilterText}>No {activeFilter.toLowerCase()} orders</AppText>
            </View>
          ) : (
            filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancel={actions.cancelOrder}
              />
            ))
          )}
        </>
      )}
    </Screen>
  );
}

// Need React for useState in the same file
import React from 'react';

const s = StyleSheet.create({
  // Page header
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingBottom: 4,
  },
  pageTitle:    { fontSize: 30, color: C.text, letterSpacing: -1, lineHeight: 33 },
  pageSubtitle: { fontSize: 13, color: C.textLight, marginTop: 3 },
  orderCountBadge: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  orderCountText: { fontSize: 15, color: C.accent },

  // Empty (no orders at all)
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconCircle: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 20, color: C.text, letterSpacing: -0.4 },
  emptyDesc:  { fontSize: 13, color: C.textLight, textAlign: 'center', lineHeight: 20 },
  emptyBtn: {
    marginTop: 8,
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: 22, paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
  },
  emptyBtnText: { fontSize: 13, color: C.accent },

  // Empty filter
  emptyFilter: {
    alignItems: 'center', paddingTop: 40, gap: 10,
  },
  emptyFilterText: { fontSize: 14, color: C.textLight },
});
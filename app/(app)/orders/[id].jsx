import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { AppText } from '../../../components/ui/AppText';
import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';

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

const STATUS = {
  Placed:    { color: C.blue,   bg: C.blueSoft,   icon: 'receipt-outline',          label: 'Order Placed' },
  Confirmed: { color: C.accent, bg: C.accentSoft,  icon: 'checkmark-circle-outline', label: 'Confirmed' },
  Shipped:   { color: C.amber,  bg: C.amberSoft,   icon: 'cube-outline',             label: 'Shipped' },
  Delivered: { color: C.green,  bg: C.greenSoft,   icon: 'bag-check-outline',        label: 'Delivered' },
  Cancelled: { color: C.red,    bg: C.redSoft,     icon: 'close-circle-outline',     label: 'Cancelled' },
};

const TIMELINE_STEPS = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];

// ── Inline timeline (same logic as OrdersScreen) ──────
function Timeline({ status }) {
  const cancelled   = status === 'Cancelled';
  const currentIdx  = cancelled ? -1 : TIMELINE_STEPS.indexOf(status);

  return (
    <View style={tl.wrap}>
      {TIMELINE_STEPS.map((step, i) => {
        const done    = !cancelled && i <= currentIdx;
        const current = !cancelled && i === currentIdx;
        const cfg     = STATUS[step];

        return (
          <View key={step} style={tl.stepCol}>
            {i < TIMELINE_STEPS.length - 1 && (
              <View style={[tl.line, done && i < currentIdx && tl.lineDone]} />
            )}
            <View style={[
              tl.dot,
              done    && { backgroundColor: cfg.color, borderColor: cfg.color },
              current && tl.dotCurrent,
              cancelled && tl.dotCancelled,
            ]}>
              {done && !current && <Ionicons name="checkmark" size={9} color="#fff" />}
              {current && !cancelled && <View style={[tl.dotInner, { backgroundColor: cfg.color }]} />}
            </View>
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
  wrap:    { flexDirection: 'row', alignItems: 'flex-start' },
  stepCol: { flex: 1, alignItems: 'center', position: 'relative' },
  line: {
    position: 'absolute', top: 10, left: '50%', right: '-50%',
    height: 2, backgroundColor: C.border, zIndex: 0,
  },
  lineDone:     { backgroundColor: C.green },
  dot: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: C.border,
    backgroundColor: C.surface,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 1, marginBottom: 6,
  },
  dotCurrent:   { borderColor: C.accent, backgroundColor: C.accentSoft },
  dotCancelled: { borderColor: C.border, backgroundColor: C.bg },
  dotInner:     { width: 7, height: 7, borderRadius: 4 },
  label:        { fontSize: 10, color: C.textMid, letterSpacing: 0.1, textAlign: 'center' },
});

// ── Shared card shell ─────────────────────────────────
function SectionCard({ children, style }) {
  return <View style={[sc.wrap, style]}>{children}</View>;
}
const sc = StyleSheet.create({
  wrap: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: '#5B54E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
});

function CardHeader({ icon, title, iconBg = C.accentSoft, iconBorder = C.borderAccent, iconColor = C.accent }) {
  return (
    <View style={ch.row}>
      <View style={[ch.iconBox, { backgroundColor: iconBg, borderColor: iconBorder }]}>
        <Ionicons name={icon} size={14} color={iconColor} />
      </View>
      <AppText weight="900" style={ch.title}>{title}</AppText>
    </View>
  );
}
const ch = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title:   { fontSize: 15, color: C.text, letterSpacing: -0.3 },
});

// ── Item row ──────────────────────────────────────────
function ItemRow({ name, quantity, price, isLast }) {
  return (
    <>
      <View style={ir.row}>
        <View style={ir.nameWrap}>
          <View style={ir.dot} />
          <AppText weight="600" style={ir.name}>{name}</AppText>
        </View>
        <View style={ir.priceWrap}>
          <AppText style={ir.qty}>×{quantity}</AppText>
          <AppText weight="900" style={ir.price}>${price}</AppText>
        </View>
      </View>
      {!isLast && <View style={ir.divider} />}
    </>
  );
}
const ir = StyleSheet.create({
  row:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nameWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  dot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: C.borderAccent },
  name:     { fontSize: 13, color: C.text, flex: 1 },
  priceWrap:{ flexDirection: 'row', alignItems: 'center', gap: 8 },
  qty:      { fontSize: 12, color: C.textLight, fontWeight: '600' },
  price:    { fontSize: 14, color: C.accent },
  divider:  { height: 1, backgroundColor: C.border },
});

// ── Main screen ───────────────────────────────────────
export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const { state, actions } = useApp();
  const order = state.orders.find((item) => item.id === id);

  if (!order) return null;

  const cfg       = STATUS[order.status] ?? STATUS.Placed;
  const canCancel = ['Placed', 'Confirmed', 'Shipped'].includes(order.status);
  const orderTotal = order.items?.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2);

  return (
    <Screen showHeader>
      {/* ── Header ── */}
      <View style={s.pageHeader}>
        <View style={s.titleWrap}>
          <AppText weight="900" style={s.pageTitle}>Order Details</AppText>
          <AppText style={s.pageSubtitle}>{order.id}</AppText>
        </View>
        {/* Status badge */}
        <View style={[s.statusBadge, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon} size={12} color={cfg.color} />
          <AppText weight="700" style={[s.statusText, { color: cfg.color }]}>{cfg.label}</AppText>
        </View>
      </View>

      {/* ── Timeline ── */}
      <SectionCard>
        <CardHeader icon="map-outline" title="Tracking" />
        <View style={s.divider} />
        {order.status === 'Cancelled' ? (
          <View style={s.cancelledRow}>
            <Ionicons name="ban-outline" size={14} color={C.red} />
            <AppText weight="600" style={s.cancelledText}>This order was cancelled</AppText>
          </View>
        ) : (
          <Timeline status={order.status} />
        )}
      </SectionCard>

      {/* ── Delivery info ── */}
      <SectionCard>
        <CardHeader icon="location-outline" title="Delivery" iconBg={C.greenSoft} iconBorder="#BBF7D0" iconColor={C.green} />
        <View style={s.divider} />
        <View style={s.infoRow}>
          <View style={[s.infoIcon, { backgroundColor: C.greenSoft }]}>
            <Ionicons name="home-outline" size={12} color={C.green} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={s.infoLabel}>Address</AppText>
            <AppText weight="700" style={s.infoValue}>{order.address ?? '—'}</AppText>
          </View>
        </View>
        <View style={s.infoRow}>
          <View style={[s.infoIcon, { backgroundColor: C.accentSoft }]}>
            <Ionicons name="card-outline" size={12} color={C.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={s.infoLabel}>Payment</AppText>
            <AppText weight="700" style={s.infoValue}>{order.paymentMethod ?? '—'}</AppText>
          </View>
        </View>
        <View style={s.infoRow}>
          <View style={[s.infoIcon, { backgroundColor: C.amberSoft }]}>
            <Ionicons name="calendar-outline" size={12} color={C.amber} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={s.infoLabel}>Placed on</AppText>
            <AppText weight="700" style={s.infoValue}>{order.createdAt ?? '—'}</AppText>
          </View>
        </View>
      </SectionCard>

      {/* ── Items ── */}
      <SectionCard>
        <CardHeader icon="bag-outline" title="Items" iconBg={C.amberSoft} iconBorder="#FDE68A" iconColor={C.amber} />
        <View style={s.divider} />
        {order.items.map((item, idx) => {
          const product = state.products.find((p) => p.id === item.productId);
          return (
            <ItemRow
              key={item.productId}
              name={product?.name ?? item.productId}
              quantity={item.quantity}
              price={item.price}
              isLast={idx === order.items.length - 1}
            />
          );
        })}
        <View style={s.divider} />
        {/* Total */}
        <View style={s.totalRow}>
          <AppText style={s.totalLabel}>Order Total</AppText>
          <AppText weight="900" style={s.totalValue}>${orderTotal ?? order.total}</AppText>
        </View>
      </SectionCard>

      {/* ── Cancel CTA ── */}
      {canCancel && (
        <Pressable
          onPress={() => { actions.cancelOrder(order.id); router.back(); }}
          style={({ pressed }) => [s.cancelBtn, pressed && { opacity: 0.88 }]}
        >
          <Ionicons name="close-circle-outline" size={16} color={C.red} />
          <AppText weight="800" style={s.cancelText}>Cancel Order</AppText>
        </Pressable>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  pageHeader:   { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 8, paddingBottom: 4 },
  titleWrap:    { flex: 1 },
  pageTitle:    { fontSize: 30, color: C.text, letterSpacing: -1, lineHeight: 33 },
  pageSubtitle: { fontSize: 12, color: C.textLight, marginTop: 2 },

  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: { fontSize: 11, letterSpacing: 0.1 },

  divider:      { height: 1, backgroundColor: C.border },
  cancelledRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  cancelledText:{ fontSize: 13, color: C.red },

  infoRow:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIcon:  { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.3, marginBottom: 2 },
  infoValue: { fontSize: 13, color: C.text, letterSpacing: -0.2 },

  totalRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 13, color: C.textMid, fontWeight: '600' },
  totalValue: { fontSize: 22, color: C.accent, letterSpacing: -0.6 },

  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    backgroundColor: C.redSoft,
    borderWidth: 1.5, borderColor: '#FECACA',
    borderRadius: 18, paddingVertical: 15,
    marginTop: 4,
  },
  cancelText: { fontSize: 14, color: C.red, letterSpacing: -0.2 },
});
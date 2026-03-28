import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppInput } from '../../components/forms/AppInput';
import { AppText } from '../../components/ui/AppText';
import { Screen } from '../../components/ui/Screen';
import { Toast } from '../../components/ui/Toast';
import { useApp } from '../../context/AppContext';

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
};

// ── Cart item card ────────────────────────────────────
function CartItemCard({ item, onRemove, onDecrement, onIncrement }) {
  return (
    <View style={ci.wrap}>
      {/* Top: name + trash */}
      <View style={ci.topRow}>
        <View style={ci.iconBox}>
          <Ionicons name="cube-outline" size={14} color={C.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="900" style={ci.name}>{item.product.name}</AppText>
          <AppText style={ci.unitPrice}>${item.product.price} each</AppText>
        </View>
        <Pressable onPress={onRemove} style={ci.deleteBtn}>
          <Ionicons name="trash-outline" size={14} color={C.red} />
        </Pressable>
      </View>

      <View style={ci.divider} />

      {/* Bottom: qty stepper + line total */}
      <View style={ci.bottomRow}>
        <View style={ci.stepper}>
          <Pressable onPress={onDecrement} style={ci.stepBtn}>
            <Ionicons name="remove" size={14} color={C.textMid} />
          </Pressable>
          <AppText weight="900" style={ci.qty}>{item.quantity}</AppText>
          <Pressable onPress={onIncrement} style={[ci.stepBtn, ci.stepBtnActive]}>
            <Ionicons name="add" size={14} color={C.accent} />
          </Pressable>
        </View>
        <View style={ci.lineTotalWrap}>
          <AppText style={ci.lineTotalLabel}>Line total</AppText>
          <AppText weight="900" style={ci.lineTotal}>${item.lineTotal}</AppText>
        </View>
      </View>
    </View>
  );
}

const ci = StyleSheet.create({
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
  topRow:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  name:      { fontSize: 14, color: C.text, letterSpacing: -0.2 },
  unitPrice: { fontSize: 11, color: C.textLight, marginTop: 1 },
  deleteBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: C.redSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: C.border },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  stepper:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  stepBtnActive: { backgroundColor: C.accentSoft, borderColor: C.borderAccent },
  qty:           { fontSize: 16, color: C.text, letterSpacing: -0.4, minWidth: 28, textAlign: 'center' },

  lineTotalWrap: { alignItems: 'flex-end' },
  lineTotalLabel:{ fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.3, marginBottom: 2 },
  lineTotal:     { fontSize: 20, color: C.text, letterSpacing: -0.6 },
});

// ── Coupon card ───────────────────────────────────────
function CouponCard({ coupon, setCoupon, onApply, loading }) {
  return (
    <View style={cc.wrap}>
      <View style={cc.headerRow}>
        <View style={cc.iconBox}>
          <Ionicons name="pricetag-outline" size={14} color={C.accent} />
        </View>
        <AppText weight="900" style={cc.title}>Coupon Code</AppText>
      </View>
      <View style={cc.divider} />
      <View style={cc.inputRow}>
        <View style={{ flex: 1 }}>
          <AppInput
            label="Enter code"
            placeholder="Try FLEX20"
            value={coupon}
            onChangeText={setCoupon}
          />
        </View>
        <Pressable
          onPress={onApply}
          disabled={loading}
          style={({ pressed }) => [cc.applyBtn, pressed && { opacity: 0.85 }, loading && { opacity: 0.7 }]}
        >
          <AppText weight="800" style={cc.applyText}>{loading ? '…' : 'Apply'}</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const cc = StyleSheet.create({
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
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  title:    { fontSize: 15, color: C.text, letterSpacing: -0.3 },
  divider:  { height: 1, backgroundColor: C.border },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  applyBtn: {
    paddingHorizontal: 20, paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: C.accent,
    marginBottom: 1,
  },
  applyText: { fontSize: 13, color: '#fff' },
});

// ── Summary card ──────────────────────────────────────
function SummaryCard({ subtotal, discount, tax, total }) {
  const rows = [
    { label: 'Subtotal',   value: `$${subtotal}`, icon: 'receipt-outline',     color: C.textMid,  highlight: false },
    { label: 'Discount',   value: `-$${discount}`,icon: 'pricetag-outline',    color: C.green,    highlight: false },
    { label: 'Tax',        value: `$${tax}`,      icon: 'calculator-outline',  color: C.amber,    highlight: false },
    { label: 'Total',      value: `$${total}`,    icon: 'wallet-outline',      color: C.accent,   highlight: true  },
  ];

  return (
    <View style={sm.wrap}>
      <View style={sm.headerRow}>
        <View style={sm.iconBox}>
          <Ionicons name="reader-outline" size={14} color={C.accent} />
        </View>
        <AppText weight="900" style={sm.title}>Order Summary</AppText>
      </View>
      <View style={sm.divider} />
      {rows.map((row, i) => (
        <View key={row.label}>
          <View style={[sm.row, row.highlight && sm.totalRow]}>
            <View style={sm.labelGroup}>
              <Ionicons name={row.icon} size={12} color={row.color} />
              <AppText weight={row.highlight ? '800' : '600'} style={[sm.label, { color: row.highlight ? C.text : C.textMid }]}>
                {row.label}
              </AppText>
            </View>
            <AppText weight="900" style={[sm.value, { color: row.highlight ? C.accent : C.text }]}>
              {row.value}
            </AppText>
          </View>
          {i < rows.length - 1 && <View style={sm.rowDivider} />}
        </View>
      ))}
    </View>
  );
}

const sm = StyleSheet.create({
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
  headerRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  title:      { fontSize: 15, color: C.text, letterSpacing: -0.3 },
  divider:    { height: 1, backgroundColor: C.border },
  row:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalRow:   { paddingTop: 2 },
  labelGroup: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  label:      { fontSize: 13 },
  value:      { fontSize: 15, letterSpacing: -0.3 },
  rowDivider: { height: 1, backgroundColor: C.border, marginVertical: 2 },
});

// ── Empty state ───────────────────────────────────────
function EmptyCart() {
  return (
    <View style={es.wrap}>
      <View style={es.iconCircle}>
        <Ionicons name="cart-outline" size={30} color={C.accent} />
      </View>
      <AppText weight="800" style={es.title}>Your cart is empty</AppText>
      <AppText style={es.desc}>Add a few services from the catalog to unlock the checkout flow.</AppText>
      <Pressable onPress={() => router.replace('/(app)/(tabs)/catalog')} style={es.btn}>
        <Ionicons name="storefront-outline" size={14} color={C.accent} />
        <AppText weight="700" style={es.btnText}>Browse Services</AppText>
      </Pressable>
    </View>
  );
}

const es = StyleSheet.create({
  wrap:       { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40, gap: 12 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  title:   { fontSize: 20, color: C.text, letterSpacing: -0.4 },
  desc:    { fontSize: 13, color: C.textLight, textAlign: 'center', lineHeight: 20 },
  btn: {
    marginTop: 8,
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: 22, paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
  },
  btnText: { fontSize: 13, color: C.accent },
});

// ── Main screen ───────────────────────────────────────
export default function CartScreen() {
  const { cartSummary, actions } = useApp();
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
    <Screen showHeader>
      {/* ── Header ── */}
      <View style={s.pageHeader}>
        <View style={s.titleWrap}>
          <AppText weight="900" style={s.pageTitle}>Cart</AppText>
          {cartSummary.items.length > 0 && (
            <AppText style={s.pageSubtitle}>{cartSummary.items.length} item{cartSummary.items.length !== 1 ? 's' : ''}</AppText>
          )}
        </View>
        {cartSummary.items.length > 0 && (
          <View style={s.countBadge}>
            <AppText weight="800" style={s.countText}>{cartSummary.items.length}</AppText>
          </View>
        )}
      </View>

      {!cartSummary.items.length ? (
        <EmptyCart />
      ) : (
        <>
          {cartSummary.items.map((item) => (
            <CartItemCard
              key={item.productId}
              item={item}
              onRemove={() => actions.removeFromCart(item.productId)}
              onDecrement={() => actions.updateCartItem(item.productId, item.quantity - 1)}
              onIncrement={() => actions.updateCartItem(item.productId, item.quantity + 1)}
            />
          ))}

          <CouponCard
            coupon={coupon}
            setCoupon={setCoupon}
            onApply={applyCoupon}
            loading={loading}
          />

          <SummaryCard
            subtotal={cartSummary.subtotal}
            discount={cartSummary.discount}
            tax={cartSummary.tax}
            total={cartSummary.total}
          />

          <Pressable
            onPress={() => router.push('/(app)/checkout/address')}
            style={({ pressed }) => [s.cta, pressed && { opacity: 0.88 }]}
          >
            <Ionicons name="bag-check-outline" size={16} color="#fff" />
            <AppText weight="800" style={s.ctaText}>Proceed to Checkout</AppText>
            <View style={s.ctaArrow}>
              <Ionicons name="arrow-forward" size={15} color={C.accent} />
            </View>
          </Pressable>
        </>
      )}

      <Toast {...toast} onHide={() => setToast((p) => ({ ...p, visible: false }))} />
    </Screen>
  );
}

const s = StyleSheet.create({
  pageHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 8, paddingBottom: 4 },
  titleWrap:    { flex: 1 },
  pageTitle:    { fontSize: 30, color: C.text, letterSpacing: -1, lineHeight: 33 },
  pageSubtitle: { fontSize: 13, color: C.textLight, marginTop: 3 },
  countBadge: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  countText: { fontSize: 15, color: C.accent },
  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: C.accent,
    borderRadius: 18, paddingVertical: 16,
    marginTop: 4,
  },
  ctaText:  { fontSize: 15, color: '#fff', letterSpacing: -0.3 },
  ctaArrow: {
    width: 28, height: 28, borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
});
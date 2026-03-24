import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

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
};

const METHODS = [
  { id: 'Card',   icon: 'card-outline',          label: 'Credit / Debit Card',  sub: 'Visa, Mastercard, Amex' },
  { id: 'UPI',    icon: 'phone-portrait-outline', label: 'UPI',                  sub: 'GPay, PhonePe, Paytm' },
  { id: 'Wallet', icon: 'wallet-outline',         label: 'Wallet',               sub: 'Pay from your balance' },
];

function PaymentMethodCard({ item, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pm.wrap, active && pm.wrapActive, pressed && pm.wrapPressed]}
    >
      <View style={[pm.iconBox, active && pm.iconBoxActive]}>
        <Ionicons name={item.icon} size={18} color={active ? C.accent : C.textMid} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText weight="900" style={[pm.label, active && { color: C.accent }]}>{item.label}</AppText>
        <AppText style={pm.sub}>{item.sub}</AppText>
      </View>
      <View style={[pm.radio, active && pm.radioActive]}>
        {active && <View style={pm.radioDot} />}
      </View>
    </Pressable>
  );
}

const pm = StyleSheet.create({
  wrap: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: '#5B54E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  wrapActive:  { borderColor: C.borderAccent, backgroundColor: '#FDFCFF' },
  wrapPressed: { transform: [{ scale: 0.99 }] },

  iconBox: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBoxActive: { backgroundColor: C.accentSoft, borderColor: C.borderAccent },

  label: { fontSize: 14, color: C.text, letterSpacing: -0.2, marginBottom: 2 },
  sub:   { fontSize: 11, color: C.textLight },

  radio:       { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: C.accent },
  radioDot:    { width: 9, height: 9, borderRadius: 5, backgroundColor: C.accent },
});

function OrderSummaryCard({ total }) {
  return (
    <View style={os.wrap}>
      <View style={os.row}>
        <View style={os.labelGroup}>
          <Ionicons name="receipt-outline" size={13} color={C.textMid} />
          <AppText weight="700" style={os.label}>Order Total</AppText>
        </View>
        <AppText weight="900" style={os.total}>${total}</AppText>
      </View>
      <View style={os.divider} />
      <View style={os.row}>
        <AppText style={os.sub}>Delivery</AppText>
        <View style={os.freeBadge}>
          <AppText weight="800" style={os.freeText}>FREE</AppText>
        </View>
      </View>
    </View>
  );
}

const os = StyleSheet.create({
  wrap: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: '#5B54E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  row:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelGroup: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  label:      { fontSize: 13, color: C.textMid },
  total:      { fontSize: 26, color: C.text, letterSpacing: -0.8 },
  divider:    { height: 1, backgroundColor: C.border },
  sub:        { fontSize: 12, color: C.textLight },
  freeBadge:  { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.greenSoft },
  freeText:   { fontSize: 11, color: C.green },
});

export default function PaymentScreen() {
  const [method, setMethod] = useState('Card');
  const [loading, setLoading] = useState(false);
  const { cartSummary, actions } = useApp();

  const pay = async () => {
    setLoading(true);
    try {
      const order = await actions.placeOrder(method);
      router.replace({ pathname: '/(app)/checkout/result', params: { status: 'success', orderId: order.id } });
    } catch (error) {
      router.replace({ pathname: '/(app)/checkout/result', params: { status: 'failed', message: error.message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      {/* ── Page header ── */}
      <View style={s.pageHeader}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={18} color={C.accent} />
        </Pressable>
        <View style={s.titleWrap}>
          <AppText weight="900" style={s.pageTitle}>Payment</AppText>
          <AppText style={s.pageSubtitle}>Choose a payment method</AppText>
        </View>
      </View>

      {/* ── Step indicator ── */}
      <StepBar step={2} />

      {/* ── Methods ── */}
      {METHODS.map((item) => (
        <PaymentMethodCard
          key={item.id}
          item={item}
          active={method === item.id}
          onPress={() => setMethod(item.id)}
        />
      ))}

      {/* ── Order summary ── */}
      <OrderSummaryCard total={cartSummary.total} />

      {/* ── Pay CTA ── */}
      <Pressable
        onPress={pay}
        disabled={loading}
        style={({ pressed }) => [s.cta, pressed && { opacity: 0.88 }, loading && { opacity: 0.75 }]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="lock-closed-outline" size={15} color="#fff" />
        )}
        <AppText weight="800" style={s.ctaText}>
          {loading ? 'Processing…' : `Pay $${cartSummary.total}`}
        </AppText>
        {!loading && (
          <View style={s.ctaArrow}>
            <Ionicons name="arrow-forward" size={15} color={C.accent} />
          </View>
        )}
      </Pressable>

      {/* ── Loading state ── */}
      {loading && (
        <View style={s.loaderWrap}>
          <View style={s.loaderPill}>
            <ActivityIndicator size="small" color={C.accent} />
            <AppText weight="600" style={s.loaderText}>Verifying payment with gateway…</AppText>
          </View>
        </View>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  pageHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 8, paddingBottom: 4 },
  backBtn: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  titleWrap:    { flex: 1 },
  pageTitle:    { fontSize: 30, color: C.text, letterSpacing: -1, lineHeight: 33 },
  pageSubtitle: { fontSize: 13, color: C.textLight, marginTop: 3 },

  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: C.accent,
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: 4,
  },
  ctaText:  { fontSize: 15, color: '#fff', letterSpacing: -0.3 },
  ctaArrow: {
    width: 28, height: 28, borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },

  loaderWrap: { alignItems: 'center' },
  loaderPill: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 18, paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
  },
  loaderText: { fontSize: 12, color: C.accent },
});
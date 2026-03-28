import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
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

// ── Step bar ──────────────────────────────────────────
const STEPS = ['Address', 'Payment', 'Done'];

function StepBar({ step }) {
  return (
    <View style={sb.wrap}>
      {STEPS.map((label, i) => {
        const idx    = i + 1;
        const done   = idx < step;
        const active = idx === step;
        return (
          <React.Fragment key={label}>
            <View style={sb.step}>
              <View style={[sb.circle, done && sb.circleDone, active && sb.circleActive]}>
                {done ? (
                  <Ionicons name="checkmark" size={11} color="#fff" />
                ) : (
                  <AppText weight="900" style={[sb.num, (done || active) && sb.numLight]}>
                    {idx}
                  </AppText>
                )}
              </View>
              <AppText weight="700" style={[sb.label, active && sb.labelActive, done && sb.labelDone]}>
                {label}
              </AppText>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[sb.line, done && sb.lineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const sb = StyleSheet.create({
  wrap:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  step:  { alignItems: 'center', gap: 5 },
  circle: {
    width: 28, height: 28, borderRadius: 9,
    borderWidth: 1.5, borderColor: C.border,
    backgroundColor: C.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  circleDone:   { backgroundColor: C.accent, borderColor: C.accent },
  circleActive: { backgroundColor: C.accent, borderColor: C.accent },
  num:      { fontSize: 11, color: C.textLight },
  numLight: { color: '#fff' },
  label:      { fontSize: 10, color: C.textLight, letterSpacing: 0.2 },
  labelActive:{ color: C.accent },
  labelDone:  { color: C.textMid },
  line:     { flex: 1, height: 1.5, backgroundColor: C.border, marginBottom: 14, marginHorizontal: 6 },
  lineDone: { backgroundColor: C.accent },
});

// ── Payment method card ───────────────────────────────
const METHODS = [
  { id: 'Card',   icon: 'card-outline',           label: 'Credit / Debit Card',  sub: 'Visa, Mastercard, Amex' },
  { id: 'UPI',    icon: 'phone-portrait-outline',  label: 'UPI',                  sub: 'GPay, PhonePe, Paytm' },
  { id: 'Wallet', icon: 'wallet-outline',          label: 'Wallet',               sub: 'Pay from your balance' },
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

// ── Card details form ─────────────────────────────────
function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

function CardDetailsForm({ card, setCard }) {
  return (
    <View style={cdf.wrap}>
      {/* Card preview strip */}
      <View style={cdf.preview}>
        <View style={cdf.previewLeft}>
          <View style={cdf.chip}>
            <Ionicons name="hardware-chip-outline" size={14} color="rgba(255,255,255,0.7)" />
          </View>
          <AppText weight="900" style={cdf.previewNum}>
            {card.number || '•••• •••• •••• ••••'}
          </AppText>
        </View>
        <Ionicons name="card" size={22} color="rgba(255,255,255,0.5)" />
      </View>

      <View style={cdf.divider} />

      {/* Card number */}
      <View style={cdf.field}>
        <AppText weight="700" style={cdf.fieldLabel}>Card Number</AppText>
        <TextInput
          style={cdf.input}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor={C.textLight}
          keyboardType="numeric"
          value={card.number}
          onChangeText={(v) => setCard((p) => ({ ...p, number: formatCardNumber(v) }))}
          maxLength={19}
        />
      </View>

      <View style={cdf.row}>
        {/* Expiry */}
        <View style={[cdf.field, { flex: 1 }]}>
          <AppText weight="700" style={cdf.fieldLabel}>Expiry</AppText>
          <TextInput
            style={cdf.input}
            placeholder="MM/YY"
            placeholderTextColor={C.textLight}
            keyboardType="numeric"
            value={card.expiry}
            onChangeText={(v) => setCard((p) => ({ ...p, expiry: formatExpiry(v) }))}
            maxLength={5}
          />
        </View>

        {/* CVV */}
        <View style={[cdf.field, { flex: 1 }]}>
          <AppText weight="700" style={cdf.fieldLabel}>CVV</AppText>
          <TextInput
            style={cdf.input}
            placeholder="•••"
            placeholderTextColor={C.textLight}
            keyboardType="numeric"
            secureTextEntry
            value={card.cvv}
            onChangeText={(v) => setCard((p) => ({ ...p, cvv: v.replace(/\D/g, '').slice(0, 3) }))}
            maxLength={3}
          />
        </View>
      </View>

      {/* Name */}
      <View style={cdf.field}>
        <AppText weight="700" style={cdf.fieldLabel}>Name on Card</AppText>
        <TextInput
          style={cdf.input}
          placeholder="Your full name"
          placeholderTextColor={C.textLight}
          autoCapitalize="words"
          value={card.name}
          onChangeText={(v) => setCard((p) => ({ ...p, name: v }))}
        />
      </View>

      <View style={cdf.secureRow}>
        <Ionicons name="lock-closed-outline" size={11} color={C.green} />
        <AppText style={cdf.secureText}>256-bit SSL encrypted · PCI DSS compliant</AppText>
      </View>
    </View>
  );
}

const cdf = StyleSheet.create({
  wrap: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    borderWidth: 1.5,
    borderColor: C.borderAccent,
    shadowColor: '#5B54E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },

  preview: {
    backgroundColor: C.accent,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 70,
  },
  previewLeft: { gap: 8 },
  chip:        { opacity: 0.8 },
  previewNum:  { fontSize: 13, color: 'rgba(255,255,255,0.9)', letterSpacing: 1.5 },

  divider: { height: 1, backgroundColor: C.border },

  row:        { flexDirection: 'row', gap: 12 },
  field:      { gap: 6 },
  fieldLabel: { fontSize: 11, color: C.textMid, letterSpacing: 0.3 },
  input: {
    backgroundColor: C.bg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: C.text,
    letterSpacing: 0.3,
  },

  secureRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  secureText:{ fontSize: 10, color: C.textLight },
});

// ── UPI form ──────────────────────────────────────────
function UpiForm({ upiId, setUpiId }) {
  return (
    <View style={uf.wrap}>
      <View style={uf.headerRow}>
        <View style={uf.iconBox}>
          <Ionicons name="phone-portrait-outline" size={15} color={C.accent} />
        </View>
        <AppText weight="900" style={uf.title}>Enter UPI ID</AppText>
      </View>
      <View style={uf.divider} />
      <View style={uf.field}>
        <AppText weight="700" style={uf.fieldLabel}>UPI ID</AppText>
        <TextInput
          style={uf.input}
          placeholder="yourname@upi"
          placeholderTextColor={C.textLight}
          keyboardType="email-address"
          autoCapitalize="none"
          value={upiId}
          onChangeText={setUpiId}
        />
      </View>
      <View style={uf.appRow}>
        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
          <View key={app} style={uf.appChip}>
            <AppText weight="700" style={uf.appText}>{app}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const uf = StyleSheet.create({
  wrap: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    borderWidth: 1.5,
    borderColor: C.borderAccent,
    shadowColor: '#5B54E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  title:    { fontSize: 15, color: C.text, letterSpacing: -0.3 },
  divider:  { height: 1, backgroundColor: C.border },
  field:    { gap: 6 },
  fieldLabel: { fontSize: 11, color: C.textMid, letterSpacing: 0.3 },
  input: {
    backgroundColor: C.bg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: C.text,
  },
  appRow:  { flexDirection: 'row', gap: 8 },
  appChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.border,
  },
  appText: { fontSize: 11, color: C.textMid },
});

// ── Order summary card ────────────────────────────────
function OrderSummaryCard({ subtotal, discount, tax, total }) {
  const rows = [
    { label: 'Subtotal',  value: `$${subtotal}`, color: C.textMid },
    { label: 'Discount',  value: `-$${discount}`, color: C.green },
    { label: 'Tax (8%)',  value: `$${tax}`,       color: C.amber },
  ];

  return (
    <View style={os.wrap}>
      <View style={os.headerRow}>
        <View style={os.iconBox}>
          <Ionicons name="receipt-outline" size={14} color={C.accent} />
        </View>
        <AppText weight="900" style={os.title}>Order Summary</AppText>
      </View>
      <View style={os.divider} />
      {rows.map((row) => (
        <View key={row.label} style={os.row}>
          <AppText style={os.rowLabel}>{row.label}</AppText>
          <AppText weight="700" style={[os.rowValue, { color: row.color }]}>{row.value}</AppText>
        </View>
      ))}
      <View style={os.totalDivider} />
      <View style={os.row}>
        <AppText weight="900" style={os.totalLabel}>Total</AppText>
        <AppText weight="900" style={os.totalValue}>${total}</AppText>
      </View>
      <View style={os.freeRow}>
        <View style={os.freeBadge}>
          <Ionicons name="bicycle-outline" size={11} color={C.green} />
          <AppText weight="800" style={os.freeText}>Free delivery included</AppText>
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
    gap: 10,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: '#5B54E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  iconBox: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  title:       { fontSize: 15, color: C.text, letterSpacing: -0.3 },
  divider:     { height: 1, backgroundColor: C.border, marginBottom: 2 },
  totalDivider:{ height: 1, backgroundColor: C.border, marginVertical: 4 },
  row:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel:    { fontSize: 13, color: C.textMid },
  rowValue:    { fontSize: 13 },
  totalLabel:  { fontSize: 16, color: C.text, letterSpacing: -0.3 },
  totalValue:  { fontSize: 24, color: C.accent, letterSpacing: -0.8 },
  freeRow:     { alignItems: 'flex-start', marginTop: 2 },
  freeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
    backgroundColor: C.greenSoft, borderWidth: 1, borderColor: '#BBF7D0',
  },
  freeText: { fontSize: 10, color: C.green },
});

// ── Screen ────────────────────────────────────────────
export default function PaymentScreen() {
  const [method, setMethod] = useState('Card');
  const [loading, setLoading] = useState(false);
  const [card, setCard]     = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId]   = useState('');
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
    <Screen showHeader contentContainerStyle={{ flexGrow: 0 }}>
      {/* ── Page header ── */}
      <View style={s.pageHeader}>
        <View style={s.titleWrap}>
          <AppText weight="900" style={s.pageTitle}>Payment</AppText>
          <AppText style={s.pageSubtitle}>Choose a payment method</AppText>
        </View>
      </View>

      {/* ── Step bar ── */}
      <StepBar step={2} />

      {/* ── Payment methods ── */}
      {METHODS.map((item) => (
        <PaymentMethodCard
          key={item.id}
          item={item}
          active={method === item.id}
          onPress={() => setMethod(item.id)}
        />
      ))}

      {/* ── Method-specific details ── */}
      {method === 'Card'   && <CardDetailsForm card={card} setCard={setCard} />}
      {method === 'UPI'    && <UpiForm upiId={upiId} setUpiId={setUpiId} />}

      {/* ── Order summary ── */}
      <OrderSummaryCard
        subtotal={cartSummary.subtotal}
        discount={cartSummary.discount}
        tax={cartSummary.tax}
        total={cartSummary.total}
      />

      {/* ── Pay CTA ── */}
      <Pressable
        onPress={pay}
        disabled={loading}
        style={({ pressed }) => [s.cta, pressed && { opacity: 0.88 }, loading && { opacity: 0.75 }]}
      >
        {loading
          ? <ActivityIndicator size="small" color="#fff" />
          : <Ionicons name="lock-closed-outline" size={15} color="#fff" />
        }
        <AppText weight="800" style={s.ctaText}>
          {loading ? 'Processing…' : `Pay $${cartSummary.total}`}
        </AppText>
        {!loading && (
          <View style={s.ctaArrow}>
            <Ionicons name="arrow-forward" size={15} color={C.accent} />
          </View>
        )}
      </Pressable>

      {loading && (
        <View style={s.loaderWrap}>
          <View style={s.loaderPill}>
            <ActivityIndicator size="small" color={C.accent} />
            <AppText weight="600" style={s.loaderText}>Verifying with payment gateway…</AppText>
          </View>
        </View>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  pageHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 8, paddingBottom: 4 },
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

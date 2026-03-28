import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppText } from '../../../components/ui/AppText';
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
};

// ── Step bar ──────────────────────────────────────────
const STEPS = ['Address', 'Payment', 'Done'];

function StepBar({ step }) {
  return (
    <View style={sb.wrap}>
      {STEPS.map((label, i) => {
        const idx   = i + 1;
        const done  = idx < step;
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

// ── Address card ──────────────────────────────────────
function AddressCard({ item, active, onPress }) {
  const icon = item.label?.toLowerCase().includes('home')
    ? 'home-outline'
    : item.label?.toLowerCase().includes('work') || item.label?.toLowerCase().includes('office') || item.label?.toLowerCase().includes('client')
      ? 'briefcase-outline'
      : 'location-outline';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [ac.wrap, active && ac.wrapActive, pressed && ac.wrapPressed]}
    >
      <View style={[ac.iconBox, active && ac.iconBoxActive]}>
        <Ionicons name={icon} size={16} color={active ? C.accent : C.textMid} />
      </View>

      <View style={{ flex: 1 }}>
        <View style={ac.topRow}>
          <AppText weight="900" style={[ac.label, active && { color: C.accent }]}>{item.label}</AppText>
          {active && (
            <View style={ac.activeBadge}>
              <AppText weight="800" style={ac.activeBadgeText}>Selected</AppText>
            </View>
          )}
        </View>
        <AppText style={ac.address}>{item.address}</AppText>
      </View>

      <View style={[ac.radio, active && ac.radioActive]}>
        {active && <View style={ac.radioDot} />}
      </View>
    </Pressable>
  );
}

const ac = StyleSheet.create({
  wrap: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
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
    flexShrink: 0,
  },
  iconBoxActive: { backgroundColor: C.accentSoft, borderColor: C.borderAccent },

  topRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  label:    { fontSize: 14, color: C.text, letterSpacing: -0.2 },
  address:  { fontSize: 12, color: C.textLight, lineHeight: 17 },

  activeBadge: {
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999,
    backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.borderAccent,
  },
  activeBadgeText: { fontSize: 9, color: C.accent, letterSpacing: 0.3 },

  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  radioActive: { borderColor: C.accent },
  radioDot:    { width: 9, height: 9, borderRadius: 5, backgroundColor: C.accent },
});

// ── Delivery estimate card ────────────────────────────
function DeliveryCard() {
  const today = new Date();
  const eta   = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  const label = eta.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <View style={dc.wrap}>
      <View style={dc.row}>
        <View style={dc.iconBox}>
          <Ionicons name="bicycle-outline" size={16} color={C.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="900" style={dc.title}>Estimated Delivery</AppText>
          <AppText style={dc.sub}>Standard delivery · Free</AppText>
        </View>
        <View style={dc.etaBadge}>
          <AppText weight="800" style={dc.etaText}>{label}</AppText>
        </View>
      </View>

      <View style={dc.divider} />

      <View style={dc.row}>
        <Ionicons name="shield-checkmark-outline" size={13} color={C.green} />
        <AppText style={dc.note}>Secure delivery with tracking updates via notifications</AppText>
      </View>
    </View>
  );
}

const dc = StyleSheet.create({
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
  row:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  title:   { fontSize: 14, color: C.text, letterSpacing: -0.2, marginBottom: 2 },
  sub:     { fontSize: 11, color: C.textLight },
  etaBadge:{
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
    backgroundColor: C.greenSoft, borderWidth: 1, borderColor: '#BBF7D0',
  },
  etaText: { fontSize: 11, color: C.green },
  divider: { height: 1, backgroundColor: C.border },
  note:    { fontSize: 11, color: C.textLight, flex: 1, lineHeight: 16 },
});

// ── Screen ────────────────────────────────────────────
export default function AddressScreen() {
  const { state, actions } = useApp();

  return (
    <Screen showHeader contentContainerStyle={{ flexGrow: 0 }}>
      {/* ── Page header ── */}
      <View style={s.pageHeader}>
        <View style={s.titleWrap}>
          <AppText weight="900" style={s.pageTitle}>Delivery</AppText>
          <AppText style={s.pageSubtitle}>Where should we deliver?</AppText>
        </View>
      </View>

      {/* ── Step bar ── */}
      <StepBar step={1} />

      {/* ── Address list ── */}
      {state.addresses.map((item) => (
        <AddressCard
          key={item.id}
          item={item}
          active={state.selectedAddressId === item.id}
          onPress={() => actions.setAddress(item.id)}
        />
      ))}

      {/* ── Delivery estimate ── */}
      <DeliveryCard />

      {/* ── CTA ── */}
      <Pressable
        onPress={() => router.push('/(app)/checkout/payment')}
        style={({ pressed }) => [s.cta, pressed && { opacity: 0.88 }]}
      >
        <AppText weight="800" style={s.ctaText}>Continue to Payment</AppText>
        <View style={s.ctaArrow}>
          <Ionicons name="arrow-forward" size={15} color={C.accent} />
        </View>
      </Pressable>
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
});

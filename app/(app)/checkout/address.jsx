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

// ── Address card ──────────────────────────────────────
function AddressCard({ item, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [ac.wrap, active && ac.wrapActive, pressed && ac.wrapPressed]}
    >
      {/* Left: icon + content */}
      <View style={ac.leftRow}>
        <View style={[ac.iconBox, active && ac.iconBoxActive]}>
          <Ionicons
            name={item.label?.toLowerCase().includes('home') ? 'home-outline' : item.label?.toLowerCase().includes('work') ? 'briefcase-outline' : 'location-outline'}
            size={15}
            color={active ? C.accent : C.textMid}
          />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="900" style={[ac.label, active && { color: C.accent }]}>{item.label}</AppText>
          <AppText style={ac.address}>{item.address}</AppText>
        </View>
      </View>

      {/* Right: radio */}
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

  leftRow:  { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 42, height: 42, borderRadius: 13,
    backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBoxActive: { backgroundColor: C.accentSoft, borderColor: C.borderAccent },

  label:   { fontSize: 14, color: C.text, letterSpacing: -0.2, marginBottom: 3 },
  address: { fontSize: 12, color: C.textLight, lineHeight: 17 },

  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: C.accent },
  radioDot:    { width: 9, height: 9, borderRadius: 5, backgroundColor: C.accent },
});

export default function AddressScreen() {
  const { state, actions } = useApp();

  return (
    <Screen>
      {/* ── Page header ── */}
      <View style={s.pageHeader}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={18} color={C.accent} />
        </Pressable>
        <View style={s.titleWrap}>
          <AppText weight="900" style={s.pageTitle}>Delivery Address</AppText>
          <AppText style={s.pageSubtitle}>Choose where to deliver</AppText>
        </View>
      </View>

      {/* ── Step indicator ── */}
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
});
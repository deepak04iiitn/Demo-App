import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { AppText } from '../../../components/ui/AppText';
import { Screen } from '../../../components/ui/Screen';

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
  red:          '#EF4444',
  redSoft:      '#FEE2E2',
};

// ── Completed step bar ────────────────────────────────
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
                {done || active ? (
                  <Ionicons name="checkmark" size={11} color="#fff" />
                ) : (
                  <AppText weight="900" style={sb.num}>{idx}</AppText>
                )}
              </View>
              <AppText weight="700" style={[sb.label, (active || done) && sb.labelDone]}>
                {label}
              </AppText>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[sb.line, (done || active) && sb.lineDone]} />
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
  circleActive: { backgroundColor: C.green,  borderColor: C.green },
  num:      { fontSize: 11, color: C.textLight },
  label:    { fontSize: 10, color: C.textLight, letterSpacing: 0.2 },
  labelDone:{ color: C.textMid },
  line:     { flex: 1, height: 1.5, backgroundColor: C.border, marginBottom: 14, marginHorizontal: 6 },
  lineDone: { backgroundColor: C.accent },
});

// ── What's next row ───────────────────────────────────
function NextStepRow({ icon, title, sub, color = C.accent, bg = C.accentSoft, border = C.borderAccent }) {
  return (
    <View style={[ns.wrap, { borderColor: border }]}>
      <View style={[ns.iconBox, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={15} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText weight="800" style={[ns.title, { color }]}>{title}</AppText>
        <AppText style={ns.sub}>{sub}</AppText>
      </View>
    </View>
  );
}

const ns = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.surface,
    borderRadius: 18, padding: 16,
    borderWidth: 1.5,
  },
  iconBox: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  title:   { fontSize: 13, letterSpacing: -0.2, marginBottom: 2 },
  sub:     { fontSize: 11, color: C.textLight, lineHeight: 15 },
});

// ── Screen ────────────────────────────────────────────
export default function CheckoutResultScreen() {
  const { status, orderId, message } = useLocalSearchParams();
  const success = status === 'success';

  const iconColor  = success ? C.green : C.red;
  const iconBg     = success ? C.greenSoft : C.redSoft;
  const iconBorder = success ? '#BBF7D0' : '#FECACA';

  return (
    <Screen showHeader contentContainerStyle={rs.container}>

      {/* ── Step bar ── */}
      <StepBar step={success ? 3 : 2} />

      {/* ── Result icon ── */}
      <View style={[rs.iconCircle, { backgroundColor: iconBg, borderColor: iconBorder }]}>
        <Ionicons
          name={success ? 'checkmark-circle' : 'close-circle'}
          size={54}
          color={iconColor}
        />
      </View>

      {/* ── Headline ── */}
      <View style={rs.textGroup}>
        <AppText weight="900" style={rs.headline}>
          {success ? 'Payment Successful!' : 'Payment Failed'}
        </AppText>
        <AppText style={rs.sub}>
          {success
            ? 'Your order has been placed. We\'ll notify you when it ships.'
            : message ?? 'Something went wrong. Please try again.'}
        </AppText>
      </View>

      {/* ── Order ID pill ── */}
      {success && (
        <View style={rs.orderIdPill}>
          <Ionicons name="receipt-outline" size={12} color={C.accent} />
          <AppText weight="700" style={rs.orderIdLabel}>Order ID</AppText>
          <AppText weight="900" style={rs.orderIdValue}>{orderId}</AppText>
        </View>
      )}

      {/* ── What's next (success) ── */}
      {success && (
        <View style={rs.nextWrap}>
          <AppText weight="800" style={rs.nextTitle}>What happens next?</AppText>
          <NextStepRow
            icon="cube-outline"
            title="Order Confirmed"
            sub="Your order is being prepared by the seller"
            color={C.accent}
            bg={C.accentSoft}
            border={C.borderAccent}
          />
          <NextStepRow
            icon="bicycle-outline"
            title="Out for Delivery"
            sub="Estimated delivery in 2–3 business days"
            color="#F59E0B"
            bg="#FEF3C7"
            border="#FCD34D"
          />
          <NextStepRow
            icon="notifications-outline"
            title="Stay Updated"
            sub="Track your order in the Orders tab anytime"
            color={C.green}
            bg={C.greenSoft}
            border="#BBF7D0"
          />
        </View>
      )}

      {/* ── Primary CTA ── */}
      <Pressable
        onPress={() => router.replace(success ? '/(app)/(tabs)/orders' : '/(app)/cart')}
        style={({ pressed }) => [rs.cta, pressed && { opacity: 0.88 }, !success && rs.ctaDanger]}
      >
        <Ionicons
          name={success ? 'bag-check-outline' : 'arrow-undo-outline'}
          size={16}
          color="#fff"
        />
        <AppText weight="800" style={rs.ctaText}>
          {success ? 'View My Orders' : 'Back to Cart'}
        </AppText>
      </Pressable>

      {/* ── Secondary link ── */}
      <Pressable onPress={() => router.replace('/(app)/(tabs)/home')} style={rs.secondaryBtn}>
        <Ionicons name="home-outline" size={13} color={C.accent} />
        <AppText weight="700" style={rs.secondaryText}>Return to Home</AppText>
      </Pressable>

    </Screen>
  );
}

const rs = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 24,
    gap: 20,
  },

  iconCircle: {
    width: 100, height: 100, borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
  },

  textGroup: { alignItems: 'center', gap: 8 },
  headline:  { fontSize: 26, color: C.text, letterSpacing: -0.8, textAlign: 'center' },
  sub:       { fontSize: 13, color: C.textLight, textAlign: 'center', lineHeight: 20 },

  orderIdPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'center',
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
  },
  orderIdLabel:{ fontSize: 11, color: C.textMid },
  orderIdValue:{ fontSize: 12, color: C.accent },

  nextWrap: { gap: 10 },
  nextTitle: { fontSize: 13, color: C.textMid, letterSpacing: -0.2, marginBottom: 2 },

  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    backgroundColor: C.accent,
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: 4,
  },
  ctaDanger: { backgroundColor: C.red },
  ctaText:   { fontSize: 15, color: '#fff', letterSpacing: -0.3 },

  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
  },
  secondaryText: { fontSize: 13, color: C.accent },
});

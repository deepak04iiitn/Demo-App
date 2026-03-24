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

export default function CheckoutResultScreen() {
  const { status, orderId, message } = useLocalSearchParams();
  const success = status === 'success';

  const iconColor  = success ? C.green  : C.red;
  const iconBg     = success ? C.greenSoft : C.redSoft;
  const iconBorder = success ? '#BBF7D0' : '#FECACA';

  return (
    <Screen contentContainerStyle={rs.container}>

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
          {success ? 'Payment Successful' : 'Payment Failed'}
        </AppText>
        <AppText style={rs.sub}>
          {success
            ? `Your order ${orderId} is now active and visible in order history.`
            : message ?? 'Something went wrong. Please try again.'}
        </AppText>
      </View>

      {/* ── Order ID pill (success only) ── */}
      {success && (
        <View style={rs.orderIdPill}>
          <Ionicons name="receipt-outline" size={12} color={C.accent} />
          <AppText weight="700" style={rs.orderIdText}>{orderId}</AppText>
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
          {success ? 'View Orders' : 'Back to Cart'}
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20, paddingHorizontal: 32 },

  iconCircle: {
    width: 110, height: 110, borderRadius: 34,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },

  textGroup: { alignItems: 'center', gap: 10 },
  headline:  { fontSize: 26, color: C.text, letterSpacing: -0.8, textAlign: 'center' },
  sub:       { fontSize: 13, color: C.textLight, textAlign: 'center', lineHeight: 20 },

  orderIdPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
  },
  orderIdText: { fontSize: 12, color: C.accent },

  cta: {
    flexDirection: 'row', alignItems: 'center', gap: 9,
    backgroundColor: C.accent,
    borderRadius: 18,
    paddingVertical: 15, paddingHorizontal: 32,
    marginTop: 4,
  },
  ctaDanger: { backgroundColor: C.red },
  ctaText:   { fontSize: 15, color: '#fff', letterSpacing: -0.3 },

  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
  },
  secondaryText: { fontSize: 13, color: C.accent },
});
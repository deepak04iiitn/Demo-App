import { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { Toast } from '../../components/ui/Toast';
import { AppText } from '../../components/ui/AppText';
import { useApp } from '../../context/AppContext';

// ─── Float Label Input ────────────────────────────────────────────────────────
function FloatInput({ label, value, onChangeText, keyboardType, autoCapitalize }) {
  const labelAnim  = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const animate = (toValue) => {
    Animated.parallel([
      Animated.spring(labelAnim,  { toValue, useNativeDriver: false, damping: 20, stiffness: 180 }),
      Animated.timing(borderAnim, { toValue, duration: 180, useNativeDriver: false }),
    ]).start();
  };

  const handleFocus = () => animate(1);
  const handleBlur  = () => { if (!value) animate(0); };

  const labelTop    = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 8] });
  const labelSize   = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 11] });
  const labelColor  = labelAnim.interpolate({ inputRange: [0, 1], outputRange: ['#6B7280', '#111827'] });
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E7EB', '#111827'],
  });

  return (
    <Animated.View style={[iS.container, { borderBottomColor: borderColor }]}>
      <View style={iS.inner}>
        <Animated.Text style={[iS.label, { top: labelTop, fontSize: labelSize, color: labelColor }]}>
          {label}
        </Animated.Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          style={iS.input}
          selectionColor="#111827"
          cursorColor="#111827"
          placeholderTextColor="transparent"
        />
      </View>
    </Animated.View>
  );
}

const iS = StyleSheet.create({
  container: {
    borderBottomWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  inner:  { flex: 1, position: 'relative', paddingTop: 22 },
  label:  { position: 'absolute', left: 0, fontWeight: '500', letterSpacing: 0.2 },
  input:  { color: '#111827', fontSize: 15, fontWeight: '500', paddingTop: 4, paddingBottom: 0 },
});

// ─── Primary Button ───────────────────────────────────────────────────────────
function PrimaryButton({ label, onPress, loading }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, damping: 15 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, damping: 12 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}
        activeOpacity={1} disabled={loading} style={bS.btn}
      >
        {loading ? (
          <View style={bS.loadingRow}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[bS.dot, { opacity: 0.3 + i * 0.3 }]} />
            ))}
          </View>
        ) : (
          <AppText weight="700" style={bS.label}>{label}</AppText>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const bS = StyleSheet.create({
  btn: {
    height: 56, borderRadius: 14,
    backgroundColor: '#111827',
    alignItems: 'center', justifyContent: 'center',
  },
  label:      { fontSize: 15, color: '#fff', letterSpacing: 0.3 },
  loadingRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot:        { width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' },
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ForgotPasswordScreen() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState({ visible: false, message: '', type: 'success' });
  const [sent, setSent]       = useState(false);
  const { actions } = useApp();

  const submit = async () => {
    try {
      setLoading(true);
      const result = await actions.forgotPassword(email);
      setSent(true);
      setToast({ visible: true, message: result.message, type: 'success' });
    } catch (error) {
      setToast({ visible: true, message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand */}
          <View style={s.brandRow}>
            <View style={s.brandDot} />
            <AppText style={s.brandText}>FLOWMART</AppText>
          </View>

          {/* Headline */}
          <View style={s.headlineBlock}>
            <AppText weight="900" style={s.headline}>Reset your{'\n'}password.</AppText>
            <AppText style={s.subheadline}>
              Enter your email and we'll send you a link to get back in.
            </AppText>
          </View>

          {!sent ? (
            <>
              {/* Field */}
              <View style={s.fields}>
                <FloatInput
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* CTA */}
              <PrimaryButton label="Send Reset Link" onPress={submit} loading={loading} />
            </>
          ) : (
            /* Success state */
            <View style={s.successCard}>
              <View style={s.successIconWrap}>
                <AppText style={s.successIcon}>✓</AppText>
              </View>
              <AppText weight="700" style={s.successTitle}>Check your inbox</AppText>
              <AppText style={s.successBody}>
                We've sent a reset link to{' '}
                <AppText weight="600" style={s.successEmail}>{email}</AppText>.
                {' '}It may take a moment to arrive.
              </AppText>
            </View>
          )}

          {/* Back to login */}
          <TouchableOpacity onPress={() => router.back()} style={s.backWrap}>
            <AppText style={s.backArrow}>←</AppText>
            <AppText weight="600" style={s.backText}>Back to sign in</AppText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast {...toast} onHide={() => setToast((p) => ({ ...p, visible: false }))} />
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingHorizontal: 28, paddingTop: 72, paddingBottom: 48, gap: 32 },

  // Brand
  brandRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: '#111827' },
  brandText: { fontSize: 11, letterSpacing: 3, fontWeight: '700', color: '#111827' },

  // Headline
  headlineBlock: { gap: 10 },
  headline:      { fontSize: 40, lineHeight: 46, color: '#111827', letterSpacing: -1 },
  subheadline:   { fontSize: 15, lineHeight: 22, color: '#6B7280', fontWeight: '400' },

  // Fields
  fields: { gap: 24 },

  // Success card
  successCard: {
    borderWidth: 1.5, borderColor: '#F3F4F6',
    borderRadius: 16, padding: 24,
    gap: 12, alignItems: 'flex-start',
    backgroundColor: '#FAFAFA',
  },
  successIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#111827',
    alignItems: 'center', justifyContent: 'center',
  },
  successIcon:  { fontSize: 18, color: '#fff', fontWeight: '700' },
  successTitle: { fontSize: 16, color: '#111827' },
  successBody:  { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  successEmail: { color: '#111827' },

  // Back
  backWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start' },
  backArrow:{ fontSize: 16, color: '#6B7280' },
  backText: { fontSize: 14, color: '#6B7280' },
});
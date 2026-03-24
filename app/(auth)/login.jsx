import { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';

import { Toast } from '../../components/ui/Toast';
import { AppText } from '../../components/ui/AppText';
import { useApp } from '../../context/AppContext';

// ─── Float Label Input ────────────────────────────────────────────────────────
function FloatInput({ label, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize }) {
  const labelAnim  = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const [showPass, setShowPass] = useState(false);

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
          secureTextEntry={secureTextEntry && !showPass}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          style={iS.input}
          selectionColor="#111827"
          cursorColor="#111827"
          placeholderTextColor="transparent"
        />
      </View>
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setShowPass((p) => !p)} style={iS.eyeBtn}>
          <AppText style={iS.eyeText}>{showPass ? 'Hide' : 'Show'}</AppText>
        </TouchableOpacity>
      )}
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
  inner:   { flex: 1, position: 'relative', paddingTop: 22 },
  label:   { position: 'absolute', left: 0, fontWeight: '500', letterSpacing: 0.2 },
  input:   { color: '#111827', fontSize: 15, fontWeight: '500', paddingTop: 4, paddingBottom: 0 },
  eyeBtn:  { paddingLeft: 12 },
  eyeText: { fontSize: 12, color: '#6B7280', fontWeight: '600', letterSpacing: 0.3 },
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

// ─── Social Button ────────────────────────────────────────────────────────────
function SocialButton({ label, onPress, icon }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, damping: 15 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, damping: 12 }).start();

  return (
    <Animated.View style={[{ flex: 1 }, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}
        activeOpacity={1} style={bS.socialBtn}
      >
        <AppText style={bS.socialIcon}>{icon}</AppText>
        <AppText weight="600" style={bS.socialLabel}>{label}</AppText>
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

  socialBtn: {
    height: 52, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: '#fff', width: '100%',
  },
  socialIcon:  { fontSize: 18 },
  socialLabel: { fontSize: 14, color: '#111827', letterSpacing: 0.1 },
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const [form, setForm]       = useState({ email: 'nia@example.com', password: 'secret123' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState({ visible: false, message: '', type: 'success' });
  const { actions } = useApp();

  const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

  const handleLogin = async () => {
    try {
      setLoading(true);
      await actions.login(form);
      router.replace('/(app)/(tabs)/home');
    } catch (error) {
      setToast({ visible: true, message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    setLoading(true);
    await actions.socialLogin(provider);
    setLoading(false);
    router.replace('/(app)/(tabs)/home');
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
            <AppText weight="900" style={s.headline}>Welcome{'\n'}back.</AppText>
            <AppText style={s.subheadline}>Sign in to continue to your account.</AppText>
          </View>

          {/* Fields */}
          <View style={s.fields}>
            <FloatInput
              label="Email Address"
              value={form.email}
              onChangeText={set('email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FloatInput
              label="Password"
              value={form.password}
              onChangeText={set('password')}
              secureTextEntry
            />
          </View>

          {/* Forgot password */}
          <Link href="/(auth)/forgot-password" asChild>
            <Pressable style={s.forgotWrap}>
              <AppText weight="600" style={s.forgotText}>Forgot password?</AppText>
            </Pressable>
          </Link>

          {/* Primary CTA */}
          <PrimaryButton label="Sign In" onPress={handleLogin} loading={loading} />

          {/* Divider */}
          <View style={s.divider}>
            <View style={s.dividerLine} />
            <AppText style={s.dividerText}>or continue with</AppText>
            <View style={s.dividerLine} />
          </View>

          {/* Social buttons */}
          <View style={s.socials}>
            <SocialButton label="Google" icon="G" onPress={() => handleSocial('Google')} />
            <SocialButton label="Apple"  icon="" onPress={() => handleSocial('Apple')}  />
          </View>

          {/* Sign up link */}
          <View style={s.signupRow}>
            <AppText style={s.signupPrompt}>Don't have an account?</AppText>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <AppText weight="700" style={s.signupLink}>Create one</AppText>
              </Pressable>
            </Link>
          </View>
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

  // Forgot
  forgotWrap: { alignSelf: 'flex-end', marginTop: -16 },
  forgotText: { fontSize: 13, color: '#111827' },

  // Divider
  divider:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#F3F4F6' },
  dividerText: { fontSize: 12, color: '#D1D5DB', fontWeight: '500', letterSpacing: 0.3 },

  // Socials — row with stretch so flex:1 children fill equally
  socials: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },

  // Sign up
  signupRow:    { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  signupPrompt: { fontSize: 14, color: '#6B7280' },
  signupLink:   { fontSize: 14, color: '#111827', fontWeight: '700' },
});
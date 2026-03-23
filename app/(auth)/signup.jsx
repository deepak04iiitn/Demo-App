import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Link, router } from 'expo-router';

import { AppButton } from '../../components/ui/AppButton';
import { AppText } from '../../components/ui/AppText';
import { AppInput } from '../../components/forms/AppInput';
import { Screen } from '../../components/ui/Screen';
import { Toast } from '../../components/ui/Toast';
import { useApp } from '../../context/AppContext';
import { useAppTheme } from '../../hooks/useAppTheme';

export default function SignupScreen() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const { actions } = useApp();
  const { colors } = useAppTheme();

  const handleSignup = async () => {
    try {
      setLoading(true);
      await actions.signup(form);
      router.replace('/(app)/(tabs)/home');
    } catch (error) {
      setToast({ visible: true, message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <AppText variant="hero" weight="900">
          Create a polished demo account
        </AppText>
        <AppText style={{ color: colors.textMuted }}>
          This flow is fully mocked but behaves like a real marketplace onboarding funnel.
        </AppText>
      </View>
      <AppInput label="Full Name" value={form.name} onChangeText={(name) => setForm((prev) => ({ ...prev, name }))} />
      <AppInput label="Email" value={form.email} onChangeText={(email) => setForm((prev) => ({ ...prev, email }))} keyboardType="email-address" autoCapitalize="none" />
      <AppInput label="Password" value={form.password} onChangeText={(password) => setForm((prev) => ({ ...prev, password }))} secureTextEntry />
      <AppButton label="Create Account" onPress={handleSignup} loading={loading} />
      <View style={styles.row}>
        <AppText style={{ color: colors.textMuted }}>Already registered?</AppText>
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <AppText weight="800" style={{ color: colors.primary }}>
              Login
            </AppText>
          </Pressable>
        </Link>
      </View>
      <Toast {...toast} onHide={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center' },
  hero: { gap: 10, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
});

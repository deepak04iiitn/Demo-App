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

export default function LoginScreen() {
  const [form, setForm] = useState({ email: 'nia@example.com', password: 'secret123' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const { actions } = useApp();
  const { colors } = useAppTheme();

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
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <AppText variant="caption" weight="800" style={{ color: colors.primary }}>
          WELCOME BACK
        </AppText>
        <AppText variant="hero" weight="900">
          Sign in to your freelance workspace
        </AppText>
        <AppText style={{ color: colors.textMuted }}>
          Use the seeded credentials or any valid mock email and a 6+ character password.
        </AppText>
      </View>
      <AppInput label="Email" value={form.email} onChangeText={(email) => setForm((prev) => ({ ...prev, email }))} keyboardType="email-address" autoCapitalize="none" />
      <AppInput label="Password" value={form.password} onChangeText={(password) => setForm((prev) => ({ ...prev, password }))} secureTextEntry />
      <Link href="/(auth)/forgot-password" asChild>
        <Pressable>
          <AppText weight="700" style={{ color: colors.primary }}>
            Forgot password?
          </AppText>
        </Pressable>
      </Link>
      <AppButton label="Login" onPress={handleLogin} loading={loading} />
      <View style={styles.socials}>
        <AppButton variant="secondary" label="Continue with Google" onPress={() => handleSocial('Google')} />
        <AppButton variant="secondary" label="Continue with Apple" onPress={() => handleSocial('Apple')} />
      </View>
      <View style={styles.row}>
        <AppText style={{ color: colors.textMuted }}>New here?</AppText>
        <Link href="/(auth)/signup" asChild>
          <Pressable>
            <AppText weight="800" style={{ color: colors.primary }}>
              Create account
            </AppText>
          </Pressable>
        </Link>
      </View>
      <Toast {...toast} onHide={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, justifyContent: 'center' },
  hero: { gap: 10, marginBottom: 8 },
  socials: { gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
});

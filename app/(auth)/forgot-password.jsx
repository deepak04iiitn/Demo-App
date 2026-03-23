import { useState } from 'react';

import { AppButton } from '../../components/ui/AppButton';
import { AppText } from '../../components/ui/AppText';
import { AppInput } from '../../components/forms/AppInput';
import { Screen } from '../../components/ui/Screen';
import { Toast } from '../../components/ui/Toast';
import { useApp } from '../../context/AppContext';
import { useAppTheme } from '../../hooks/useAppTheme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const { actions } = useApp();
  const { colors } = useAppTheme();

  const submit = async () => {
    try {
      setLoading(true);
      const result = await actions.forgotPassword(email);
      setToast({ visible: true, message: result.message, type: 'success' });
    } catch (error) {
      setToast({ visible: true, message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen contentContainerStyle={{ justifyContent: 'center' }}>
      <AppText variant="hero" weight="900">
        Forgot password
      </AppText>
      <AppText style={{ color: colors.textMuted }}>
        This is a UI-only reset flow. Enter any valid email to trigger a simulated success state.
      </AppText>
      <AppInput label="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <AppButton label="Send Reset Link" loading={loading} onPress={submit} />
      <Toast {...toast} onHide={() => setToast((prev) => ({ ...prev, visible: false }))} />
    </Screen>
  );
}

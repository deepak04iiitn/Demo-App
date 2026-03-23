import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { AppButton } from '../../../components/ui/AppButton';
import { AppText } from '../../../components/ui/AppText';
import { Screen } from '../../../components/ui/Screen';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function CheckoutResultScreen() {
  const { status, orderId, message } = useLocalSearchParams();
  const { colors } = useAppTheme();
  const success = status === 'success';

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: success ? colors.primarySoft : '#fee2e2' }]}>
        <Ionicons name={success ? 'checkmark-circle' : 'close-circle'} size={56} color={success ? colors.primary : colors.danger} />
      </View>
      <AppText variant="hero" weight="900" style={styles.center}>
        {success ? 'Payment successful' : 'Payment failed'}
      </AppText>
      <AppText style={[styles.center, { color: colors.textMuted }]}>
        {success ? `Your order ${orderId} is now active and visible in order history.` : message}
      </AppText>
      <AppButton label={success ? 'View Orders' : 'Back to Cart'} onPress={() => router.replace(success ? '/(app)/(tabs)/orders' : '/(app)/cart')} />
      <Pressable onPress={() => router.replace('/(app)/(tabs)/home')}>
        <AppText weight="700" style={{ color: colors.primary }}>
          Return to dashboard
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', gap: 18 },
  iconWrap: { width: 112, height: 112, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
});

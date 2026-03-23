import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppButton } from '../../../components/ui/AppButton';
import { AppText } from '../../../components/ui/AppText';
import { Card } from '../../../components/ui/Card';
import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

const methods = ['Card', 'UPI', 'Wallet'];

export default function PaymentScreen() {
  const [method, setMethod] = useState('Card');
  const [loading, setLoading] = useState(false);
  const { cartSummary, actions } = useApp();
  const { colors } = useAppTheme();

  const pay = async () => {
    setLoading(true);
    try {
      const order = await actions.placeOrder(method);
      router.replace({ pathname: '/(app)/checkout/result', params: { status: 'success', orderId: order.id } });
    } catch (error) {
      router.replace({ pathname: '/(app)/checkout/result', params: { status: 'failed', message: error.message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="arrow-back" size={18} color={colors.text} />
        </Pressable>
        <AppText variant="h1" weight="900">
          Payment
        </AppText>
      </View>
      {methods.map((item) => {
        const active = method === item;
        return (
          <Pressable key={item} onPress={() => setMethod(item)}>
            <Card style={{ borderColor: active ? colors.primary : colors.border }}>
              <View style={styles.row}>
                <AppText variant="h3" weight="800">
                  {item}
                </AppText>
                <Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={active ? colors.primary : colors.textSoft} />
              </View>
            </Card>
          </Pressable>
        );
      })}
      <Card>
        <View style={styles.row}>
          <AppText style={{ color: colors.textMuted }}>Order Total</AppText>
          <AppText variant="h2" weight="900">
            ${cartSummary.total}
          </AppText>
        </View>
      </Card>
      <AppButton label={loading ? 'Processing Payment...' : `Pay $${cartSummary.total}`} onPress={pay} loading={loading} />
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
          <AppText style={{ color: colors.textMuted }}>
            Simulating gateway processing and payment verification...
          </AppText>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  loaderWrap: { alignItems: 'center', gap: 12, paddingVertical: 12 },
});

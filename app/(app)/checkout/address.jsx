import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppButton } from '../../../components/ui/AppButton';
import { AppText } from '../../../components/ui/AppText';
import { Card } from '../../../components/ui/Card';
import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function AddressScreen() {
  const { state, actions } = useApp();
  const { colors } = useAppTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="arrow-back" size={18} color={colors.text} />
        </Pressable>
        <AppText variant="h1" weight="900">
          Delivery Address
        </AppText>
      </View>
      {state.addresses.map((item) => {
        const active = state.selectedAddressId === item.id;
        return (
          <Pressable key={item.id} onPress={() => actions.setAddress(item.id)}>
            <Card style={{ borderColor: active ? colors.primary : colors.border }}>
              <View style={styles.row}>
                <View style={{ flex: 1, gap: 6 }}>
                  <AppText variant="h3" weight="800">
                    {item.label}
                  </AppText>
                  <AppText style={{ color: colors.textMuted }}>{item.address}</AppText>
                </View>
                <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={20} color={active ? colors.primary : colors.textSoft} />
              </View>
            </Card>
          </Pressable>
        );
      })}
      <AppButton label="Continue to Payment" onPress={() => router.push('/(app)/checkout/payment')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});

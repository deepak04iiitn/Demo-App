import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../../../components/ui/Card';
import { Screen } from '../../../components/ui/Screen';
import { AppButton } from '../../../components/ui/AppButton';
import { AppText } from '../../../components/ui/AppText';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function ProfileScreen() {
  const { state, actions } = useApp();
  const { colors } = useAppTheme();

  const menu = [
    ['Edit Profile', '/(app)/profile/edit', 'create-outline'],
    ['Settings', '/(app)/settings', 'settings-outline'],
    ['Admin Dashboard', '/(app)/admin/index', 'speedometer-outline'],
  ];

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <AppText variant="h1" weight="900" style={{ color: '#fff' }}>
            {state.user.name.charAt(0)}
          </AppText>
        </View>
        <AppText variant="hero" weight="900" style={styles.center}>
          {state.user.name}
        </AppText>
        <AppText style={[styles.center, { color: colors.textMuted }]}>
          {state.user.occupation} in {state.user.location}
        </AppText>
        <AppText style={[styles.center, { color: colors.textMuted }]}>{state.user.bio}</AppText>
      </View>

      <Card>
        <View style={styles.row}>
          <AppText variant="caption" style={{ color: colors.textMuted }}>
            Current mode
          </AppText>
          <Pressable onPress={() => actions.setRole(state.role === 'user' ? 'admin' : 'user')} style={[styles.modeChip, { backgroundColor: colors.primarySoft }]}>
            <AppText weight="800" style={{ color: colors.primary }}>
              {state.role === 'user' ? 'Switch to Admin' : 'Switch to User'}
            </AppText>
          </Pressable>
        </View>
      </Card>

      {menu.map(([label, path, icon]) => (
        <Pressable key={label} onPress={() => router.push(path)}>
          <Card style={styles.menuCard}>
            <View style={[styles.iconWrap, { backgroundColor: colors.surfaceAlt }]}>
              <Ionicons name={icon} size={18} color={colors.primary} />
            </View>
            <AppText weight="800" style={{ flex: 1 }}>
              {label}
            </AppText>
            <Ionicons name="chevron-forward" size={18} color={colors.textSoft} />
          </Card>
        </Pressable>
      ))}

      <AppButton
        label="Logout"
        variant="secondary"
        onPress={async () => {
          await actions.logout();
          router.replace('/(auth)/login');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 8 },
  avatar: { width: 92, height: 92, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modeChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999 },
  menuCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});

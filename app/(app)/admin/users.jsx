import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppText } from '../../../components/ui/AppText';
import { Card } from '../../../components/ui/Card';
import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function AdminUsersScreen() {
  const { state } = useApp();
  const { colors } = useAppTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="arrow-back" size={18} color={colors.text} />
        </Pressable>
        <AppText variant="h1" weight="900">
          User Directory
        </AppText>
      </View>
      {state.users.map((user) => (
        <Card key={user.id} style={styles.row}>
          <View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
            <AppText weight="800" style={{ color: colors.primary }}>
              {user.name.charAt(0)}
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="h3" weight="800">
              {user.name}
            </AppText>
            <AppText style={{ color: colors.textMuted }}>{user.email}</AppText>
            <AppText style={{ color: colors.textMuted }}>
              {user.occupation} · {user.location}
            </AppText>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: user.role === 'admin' ? colors.primarySoft : colors.surfaceAlt }]}>
            <AppText weight="800" style={{ color: user.role === 'admin' ? colors.primary : colors.text }}>
              {user.role}
            </AppText>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
});

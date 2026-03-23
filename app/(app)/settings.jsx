import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppButton } from '../../components/ui/AppButton';
import { AppText } from '../../components/ui/AppText';
import { Card } from '../../components/ui/Card';
import { Screen } from '../../components/ui/Screen';
import { useApp } from '../../context/AppContext';
import { useAppTheme } from '../../hooks/useAppTheme';

export default function SettingsScreen() {
  const { state, actions } = useApp();
  const { colors } = useAppTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="arrow-back" size={18} color={colors.text} />
        </Pressable>
        <AppText variant="h1" weight="900">
          Settings
        </AppText>
      </View>
      <Card style={styles.row}>
        <View>
          <AppText variant="h3" weight="800">
            Dark mode
          </AppText>
          <AppText style={{ color: colors.textMuted }}>Switch between light and dark premium themes.</AppText>
        </View>
        <Switch value={state.themeMode === 'dark'} onValueChange={actions.toggleTheme} thumbColor="#fff" trackColor={{ true: colors.primary, false: colors.border }} />
      </Card>
      <Card style={styles.row}>
        <View>
          <AppText variant="h3" weight="800">
            Notifications
          </AppText>
          <AppText style={{ color: colors.textMuted }}>Receive mock order updates and offers.</AppText>
        </View>
        <Switch value={state.settings.notifications} onValueChange={actions.toggleNotifications} thumbColor="#fff" trackColor={{ true: colors.primary, false: colors.border }} />
      </Card>
      <Card>
        <AppText variant="h3" weight="800">
          Language
        </AppText>
        <View style={styles.langRow}>
          {['English', 'Spanish', 'French'].map((language) => (
            <Pressable
              key={language}
              onPress={() => actions.setLanguage(language)}
              style={[styles.languageChip, { backgroundColor: state.language === language ? colors.primary : colors.surfaceAlt }]}>
              <AppText weight="700" style={{ color: state.language === language ? '#fff' : colors.text }}>
                {language}
              </AppText>
            </Pressable>
          ))}
        </View>
      </Card>
      <AppButton
        label="Delete Account"
        variant="danger"
        onPress={async () => {
          await actions.deleteAccount();
          router.replace('/(auth)/login');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  langRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  languageChip: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
});

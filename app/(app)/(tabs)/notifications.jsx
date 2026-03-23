import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Screen } from '../../../components/ui/Screen';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { AppText } from '../../../components/ui/AppText';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function NotificationsScreen() {
  const { state, actions } = useApp();
  const { colors } = useAppTheme();
  const iconMap = { order: 'cube-outline', offer: 'pricetag-outline', system: 'shield-checkmark-outline' };

  return (
    <Screen>
      <SectionHeader
        title="Notifications"
        caption="System alerts, offers, and order changes"
        right={
          <Pressable onPress={actions.markNotificationsRead}>
            <AppText weight="800" style={{ color: colors.primary }}>
              Mark all read
            </AppText>
          </Pressable>
        }
      />
      {!state.notifications.length ? (
        <EmptyState title="No notifications" description="Fresh events will appear here as orders and actions update." />
      ) : (
        state.notifications.map((item) => (
          <Card key={item.id} style={{ borderColor: item.read ? colors.border : colors.primary }}>
            <View style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
                <Ionicons name={iconMap[item.type]} size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.row}>
                  <AppText variant="h3" weight="800">
                    {item.title}
                  </AppText>
                  <AppText variant="caption" style={{ color: colors.textSoft }}>
                    {item.time}
                  </AppText>
                </View>
                <AppText style={{ color: colors.textMuted }}>{item.message}</AppText>
              </View>
            </View>
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  iconWrap: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});

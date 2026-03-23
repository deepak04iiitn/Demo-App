import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../../hooks/useAppTheme';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

export function EmptyState({ icon = 'sparkles-outline', title, description, actionLabel, onAction }) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <AppText variant="h2" weight="800" style={styles.center}>
        {title}
      </AppText>
      <AppText style={[styles.center, { color: colors.textMuted }]}>{description}</AppText>
      {actionLabel ? <AppButton label={actionLabel} onPress={onAction} style={styles.button} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center' },
  button: { minWidth: 180, marginTop: 6 },
});

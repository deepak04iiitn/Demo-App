import { StyleSheet, View } from 'react-native';

import { radii, shadows } from '../../constants/theme';
import { useAppTheme } from '../../hooks/useAppTheme';

export function Card({ children, style }) {
  const { colors } = useAppTheme();

  return <View style={[styles.card, shadows.soft, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: 16,
    gap: 10,
  },
});

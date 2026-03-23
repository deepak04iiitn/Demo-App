import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { radii } from '../../constants/theme';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText } from './AppText';

export function AppButton({ label, onPress, variant = 'primary', loading, disabled, style, textStyle }) {
  const { colors } = useAppTheme();
  const variants = {
    primary: { backgroundColor: colors.primary, textColor: '#fff', borderColor: colors.primary },
    secondary: { backgroundColor: colors.surface, textColor: colors.text, borderColor: colors.border },
    ghost: { backgroundColor: 'transparent', textColor: colors.primary, borderColor: 'transparent' },
    danger: { backgroundColor: colors.danger, textColor: '#fff', borderColor: colors.danger },
  };
  const current = variants[variant];

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: current.backgroundColor, borderColor: current.borderColor, opacity: pressed || disabled ? 0.82 : 1 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={current.textColor} />
      ) : (
        <AppText weight="700" style={[{ color: current.textColor }, textStyle]}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

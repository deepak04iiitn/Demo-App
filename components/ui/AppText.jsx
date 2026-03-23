import { StyleSheet, Text } from 'react-native';

import { typography } from '../../constants/theme';
import { useAppTheme } from '../../hooks/useAppTheme';

export function AppText({ variant = 'body', weight = '400', style, children, ...props }) {
  const { colors } = useAppTheme();

  return (
    <Text
      {...props}
      style={[
        styles.base,
        { color: colors.text, fontSize: typography[variant] ?? typography.body, fontWeight: weight },
        style,
      ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({ base: { letterSpacing: 0.2 } });

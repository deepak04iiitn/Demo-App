import { StyleSheet, TextInput, View } from 'react-native';

import { radii } from '../../constants/theme';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText } from '../ui/AppText';

export function AppInput({ label, error, multiline, style, ...props }) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText variant="caption" weight="700" style={{ color: colors.textMuted }}>
          {label}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textSoft}
        multiline={multiline}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
            color: colors.text,
            minHeight: multiline ? 120 : 52,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          style,
        ]}
        {...props}
      />
      {error ? (
        <AppText variant="caption" style={{ color: colors.danger }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
  input: { borderWidth: 1, borderRadius: radii.md, paddingHorizontal: 16, paddingVertical: 14 },
});

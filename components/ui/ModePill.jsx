import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText } from './AppText';

export function ModePill({ options, value, onChange }) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      {options.map((option) => {
        const active = option === value;
        return (
          <Pressable key={option} onPress={() => onChange(option)} style={[styles.pill, { backgroundColor: active ? colors.surface : 'transparent' }]}>
            <AppText weight="700" style={{ color: active ? colors.text : colors.textMuted }}>
              {option}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', borderWidth: 1, borderRadius: 999, padding: 4 },
  pill: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 999 },
});

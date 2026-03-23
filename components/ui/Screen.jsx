import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '../../hooks/useAppTheme';

export function Screen({ children, scroll = true, contentContainerStyle, style, safeEdges = ['top', 'left', 'right'] }) {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView edges={safeEdges} style={[styles.safeArea, { backgroundColor: colors.background }, style]}>
      {scroll ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, contentContainerStyle]}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flexGrow: 1, padding: 20, gap: 16 },
});

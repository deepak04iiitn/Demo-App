import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';

export function SectionHeader({ title, caption, right }) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <AppText variant="h2" weight="800">
          {title}
        </AppText>
        {caption ? <AppText style={{ opacity: 0.72 }}>{caption}</AppText> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  copy: { flex: 1, gap: 4 },
});

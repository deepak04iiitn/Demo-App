import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../hooks/useAppTheme';
import { AppText } from './ui/AppText';

const statuses = ['Placed', 'Shipped', 'Delivered'];

export function OrderTimeline({ status }) {
  const { colors } = useAppTheme();
  const activeIndex = statuses.indexOf(status);

  return (
    <View style={styles.row}>
      {statuses.map((item, index) => {
        const active = index <= activeIndex;
        return (
          <View key={item} style={styles.item}>
            <View style={[styles.dot, { backgroundColor: active ? colors.primary : colors.border }]} />
            <AppText variant="caption" weight="700" style={{ color: active ? colors.text : colors.textSoft }}>
              {item}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  item: { flex: 1, alignItems: 'center', gap: 8 },
  dot: { width: '100%', height: 8, borderRadius: 999 },
});

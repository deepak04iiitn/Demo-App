import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { radii } from '../../constants/theme';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText } from './AppText';

export function Toast({ message, type = 'success', visible, onHide }) {
  const { colors } = useAppTheme();

  useEffect(() => {
    if (!visible) return undefined;
    const timer = setTimeout(() => onHide?.(), 3000);
    return () => clearTimeout(timer);
  }, [onHide, visible]);

  if (!visible || !message) return null;

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      exiting={FadeOutUp.duration(200)}
      style={[styles.toast, { backgroundColor: type === 'error' ? colors.danger : colors.success }]}>
      <AppText weight="700" style={{ color: '#fff' }}>
        {message}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: radii.lg,
    zIndex: 100,
  },
});

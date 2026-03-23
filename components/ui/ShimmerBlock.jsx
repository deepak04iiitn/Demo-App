import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { radii } from '../../constants/theme';
import { useAppTheme } from '../../hooks/useAppTheme';

export function ShimmerBlock({ height = 18, width = '100%', style }) {
  const pulse = useSharedValue(0.45);
  const { colors } = useAppTheme();

  useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(0.9, { duration: 700 }), withTiming(0.45, { duration: 700 })), -1, false);
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return <Animated.View style={[styles.block, { height, width, backgroundColor: colors.surfaceTint }, animatedStyle, style]} />;
}

const styles = StyleSheet.create({ block: { borderRadius: radii.md } });

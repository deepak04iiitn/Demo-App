import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';

import { Screen } from '../components/ui/Screen';
import { AppText } from '../components/ui/AppText';
import { ShimmerBlock } from '../components/ui/ShimmerBlock';
import { useApp } from '../context/AppContext';
import { useAppTheme } from '../hooks/useAppTheme';

export default function Index() {
  const { state } = useApp();
  const { colors } = useAppTheme();

  if (!state.isHydrated) {
    return (
      <Screen scroll={false} contentContainerStyle={[styles.center, { backgroundColor: colors.background }]}>
        <Animated.View entering={ZoomIn.springify()} exiting={FadeOut}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <AppText variant="h1" weight="900" style={{ color: '#fff' }}>
              F
            </AppText>
          </View>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(200)} style={styles.copy}>
          <AppText variant="hero" weight="900" style={styles.centerText}>
            Flowmart
          </AppText>
          <AppText style={[styles.centerText, { color: colors.textMuted }]}>
            Freelance marketplace demo with polished mock flows.
          </AppText>
        </Animated.View>
        <View style={styles.shimmers}>
          <ShimmerBlock width={180} height={18} />
          <ShimmerBlock width={120} height={18} />
        </View>
      </Screen>
    );
  }

  if (!state.hasCompletedOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!state.isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(app)/(tabs)/home" />;
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    alignItems: 'center',
    gap: 8,
  },
  centerText: {
    textAlign: 'center',
  },
  shimmers: {
    marginTop: 12,
    gap: 8,
  },
});

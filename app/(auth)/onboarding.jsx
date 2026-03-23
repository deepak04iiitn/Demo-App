import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

import { AppButton } from '../../components/ui/AppButton';
import { AppText } from '../../components/ui/AppText';
import { Screen } from '../../components/ui/Screen';
import { onboardingSlides } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { useAppTheme } from '../../hooks/useAppTheme';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);
  const { actions } = useApp();
  const { colors } = useAppTheme();

  const next = () => {
    if (index === onboardingSlides.length - 1) {
      actions.completeOnboarding();
      router.replace('/(auth)/login');
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1 });
  };

  return (
    <Screen scroll={false} contentContainerStyle={styles.container}>
      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        data={onboardingSlides}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => setIndex(Math.round(event.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Animated.View entering={FadeInDown.delay(200)} style={[styles.hero, { backgroundColor: item.accent }]}>
              <View style={styles.heroGlass}>
                <AppText variant="caption" weight="800" style={{ color: '#fff' }}>
                  FLOWMART
                </AppText>
                <AppText variant="hero" weight="900" style={{ color: '#fff' }}>
                  {item.title}
                </AppText>
              </View>
            </Animated.View>
            <View style={styles.copy}>
              <AppText variant="h1" weight="900">
                {item.title}
              </AppText>
              <AppText style={{ color: colors.textMuted }}>{item.subtitle}</AppText>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.dots}>
          {onboardingSlides.map((item, dotIndex) => (
            <View
              key={item.id}
              style={[styles.dot, { backgroundColor: dotIndex === index ? colors.primary : colors.border, width: dotIndex === index ? 28 : 10 }]}
            />
          ))}
        </View>
        <AppButton label={index === onboardingSlides.length - 1 ? 'Get Started' : 'Continue'} onPress={next} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0, paddingBottom: 28 },
  slide: { paddingHorizontal: 20, paddingTop: 16, gap: 24 },
  hero: {
    height: 380,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    justifyContent: 'flex-end',
  },
  heroGlass: { padding: 20, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.16)', gap: 10 },
  copy: { paddingHorizontal: 6, gap: 10 },
  footer: { paddingHorizontal: 20, gap: 18 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { height: 10, borderRadius: 99 },
});

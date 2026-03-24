import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { AppText } from '../../components/ui/AppText';
import { Screen } from '../../components/ui/Screen';
import { onboardingSlides } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

const { width, height } = Dimensions.get('window');

const SLIDE_THEMES = [
  {
    gradient: ['#0F0C29', '#302B63', '#24243E'],
    accent: '#A78BFA',
    accentSecondary: '#7C3AED',
    orb1: '#7C3AED',
    orb2: '#2563EB',
    tag: 'DISCOVER',
  },
  {
    gradient: ['#0D1117', '#0F3460', '#16213E'],
    accent: '#38BDF8',
    accentSecondary: '#0EA5E9',
    orb1: '#0EA5E9',
    orb2: '#6366F1',
    tag: 'EXPLORE',
  },
  {
    gradient: ['#0A0A0A', '#1A1A2E', '#16213E'],
    accent: '#34D399',
    accentSecondary: '#059669',
    orb1: '#059669',
    orb2: '#0D9488',
    tag: 'BEGIN',
  },
];

function OrbBackground({ theme }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View
        entering={FadeIn.duration(800)}
        style={[
          styles.orb,
          {
            width: width * 0.75,
            height: width * 0.75,
            borderRadius: width * 0.375,
            backgroundColor: theme.orb1,
            top: -width * 0.2,
            right: -width * 0.2,
            opacity: 0.18,
          },
        ]}
      />
      <Animated.View
        entering={FadeIn.duration(1000).delay(200)}
        style={[
          styles.orb,
          {
            width: width * 0.55,
            height: width * 0.55,
            borderRadius: width * 0.275,
            backgroundColor: theme.orb2,
            bottom: height * 0.28,
            left: -width * 0.15,
            opacity: 0.14,
          },
        ]}
      />
    </View>
  );
}

function SlideCard({ item, slideIndex }) {
  const theme = SLIDE_THEMES[slideIndex % SLIDE_THEMES.length];

  return (
    <LinearGradient colors={theme.gradient} style={[styles.slide, { width }]}>
      <OrbBackground theme={theme} />

      {/* Top wordmark */}
      <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.wordmark}>
        <View style={[styles.wordmarkPill, { borderColor: theme.accent + '40' }]}>
          <View style={[styles.wordmarkDot, { backgroundColor: theme.accent }]} />
          <AppText style={[styles.wordmarkText, { color: theme.accent }]}>FLOWMART</AppText>
        </View>
      </Animated.View>

      {/* Central illustration area */}
      <Animated.View entering={FadeIn.duration(700).delay(200)} style={styles.illustrationArea}>
        <View style={[styles.ring, styles.ringOuter, { borderColor: theme.accent + '18' }]} />
        <View style={[styles.ring, styles.ringMid, { borderColor: theme.accent + '30' }]} />

        {/* Core card — replaced BlurView with solid dark bg */}
        <View style={[styles.coreCard, { borderColor: 'rgba(255,255,255,0.1)' }]}>
          <LinearGradient
            colors={[theme.accentSecondary + '33', theme.accent + '22']}
            style={styles.coreGradient}
          >
            <View style={styles.iconGrid}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.iconDot,
                    {
                      backgroundColor:
                        i === 4
                          ? theme.accent
                          : i % 3 === 0
                          ? theme.accent + '70'
                          : theme.accent + '30',
                      transform: [{ scale: i === 4 ? 1.6 : 1 }],
                    },
                  ]}
                />
              ))}
            </View>
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Copy block */}
      <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.copyBlock}>
        <View style={[styles.tag, { backgroundColor: theme.accent + '1A', borderColor: theme.accent + '35' }]}>
          <View style={[styles.tagDot, { backgroundColor: theme.accent }]} />
          <AppText style={[styles.tagText, { color: theme.accent }]}>{theme.tag}</AppText>
        </View>
        <AppText weight="900" style={styles.slideTitle}>
          {item.title}
        </AppText>
        <AppText style={styles.slideSubtitle}>{item.subtitle}</AppText>
      </Animated.View>
    </LinearGradient>
  );
}

function PillButton({ label, onPress, accent }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn  = () => { scale.value = withSpring(0.96, { damping: 15 }); };
  const handlePressOut = () => { scale.value = withSpring(1,    { damping: 12 }); };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={[accent, accent + 'CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pillButton}
        >
          <AppText weight="800" style={styles.pillButtonText}>{label}</AppText>
          <View style={styles.pillArrow}>
            <AppText weight="900" style={styles.pillArrowText}>›</AppText>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);
  const { actions } = useApp();

  const theme = SLIDE_THEMES[index % SLIDE_THEMES.length];

  const next = () => {
    if (index === onboardingSlides.length - 1) {
      actions.completeOnboarding();
      router.replace('/(auth)/login');
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1 });
  };

  const skip = () => {
    actions.completeOnboarding();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.root}>
      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        data={onboardingSlides}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item, index: i }) => <SlideCard item={item} slideIndex={i} />}
      />

      {/* Footer — replaced BlurView with opaque dark bg + top border */}
      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <View style={styles.dotsRow}>
            {onboardingSlides.map((item, i) => (
              <View
                key={item.id}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === index ? theme.accent : '#ffffff22',
                    width: i === index ? 28 : 8,
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.actionRow}>
            {index < onboardingSlides.length - 1 && (
              <TouchableOpacity onPress={skip} style={styles.skipBtn}>
                <AppText style={styles.skipText}>Skip</AppText>
              </TouchableOpacity>
            )}
            <PillButton
              label={index === onboardingSlides.length - 1 ? 'Get Started' : 'Continue'}
              onPress={next}
              accent={theme.accent}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0A' },

  slide: {
    flex: 1,
    height,
    paddingBottom: 160,
    paddingTop: 56,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  orb: { position: 'absolute', transform: [{ scale: 1.2 }] },

  wordmark: { alignItems: 'flex-start' },
  wordmarkPill: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 99, borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  wordmarkDot: { width: 6, height: 6, borderRadius: 3 },
  wordmarkText: { fontSize: 11, letterSpacing: 3, fontWeight: '700' },

  illustrationArea: {
    alignItems: 'center', justifyContent: 'center',
    flex: 1, position: 'relative',
  },
  ring: { position: 'absolute', borderWidth: 1, borderRadius: 9999 },
  ringOuter: { width: width * 0.78, height: width * 0.78 },
  ringMid:   { width: width * 0.56, height: width * 0.56 },

  coreCard: {
    width: 156, height: 156, borderRadius: 36,
    overflow: 'hidden', borderWidth: 1,
    backgroundColor: 'rgba(14, 10, 28, 0.82)',
  },
  coreGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconGrid: {
    width: 96, height: 96,
    flexWrap: 'wrap', flexDirection: 'row',
    gap: 10, alignItems: 'center', justifyContent: 'center',
  },
  iconDot: { width: 18, height: 18, borderRadius: 6 },

  copyBlock: { gap: 16, paddingBottom: 8 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 99, borderWidth: 1,
  },
  tagDot:  { width: 5, height: 5, borderRadius: 3 },
  tagText: { fontSize: 10, letterSpacing: 2.5, fontWeight: '700' },

  slideTitle:    { fontSize: 36, lineHeight: 42, color: '#FFFFFF', letterSpacing: -0.5 },
  slideSubtitle: { fontSize: 15, lineHeight: 24, color: 'rgba(255,255,255,0.5)', fontWeight: '400' },

  // Footer — no BlurView
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(10, 8, 18, 0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  footerInner: {
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 36, gap: 20,
  },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 8, borderRadius: 99 },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  skipBtn:  { paddingVertical: 10, paddingHorizontal: 4 },
  skipText: { fontSize: 15, color: 'rgba(255,255,255,0.38)', fontWeight: '500' },

  pillButton: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingLeft: 28, paddingRight: 10, paddingVertical: 14,
    borderRadius: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12,
  },
  pillButtonText: { fontSize: 15, color: '#fff', letterSpacing: 0.2 },
  pillArrow: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  pillArrowText: { fontSize: 20, color: '#fff', lineHeight: 22 },
});
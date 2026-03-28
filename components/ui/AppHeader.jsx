import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppText } from './AppText';
import { useApp } from '../../context/AppContext';

const C = {
  surface:      '#FFFFFF',
  accent:       '#5B54E8',
  accentSoft:   '#ECEAFF',
  text:         '#1A1A2E',
  border:       '#E8E8E2',
  borderAccent: '#C8C5F5',
  iconBg:       '#F5F5F0',
  red:          '#EF4444',
};

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const { state, cartSummary } = useApp();
  const canGoBack    = router.canGoBack();
  const unreadCount  = state.notifications.filter((n) => !n.read).length;
  const cartCount    = cartSummary.items.length;

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.inner}>

        {/* ── Left: back OR logo ── */}
        {canGoBack ? (
          <Pressable onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={18} color={C.accent} />
          </Pressable>
        ) : (
          <View style={s.logoGroup}>
            <View style={s.logoBox}>
              <AppText weight="900" style={s.logoLetter}>F</AppText>
            </View>
            <AppText weight="900" style={s.brandName}>Flowmart</AppText>
          </View>
        )}

        {/* ── Right: notifications + cart ── */}
        <View style={s.rightGroup}>
          <Pressable
            onPress={() => router.push('/(app)/(tabs)/notifications')}
            style={s.iconBtn}
          >
            <Ionicons name="notifications-outline" size={20} color={C.text} />
            {unreadCount > 0 && (
              <View style={s.badge}>
                <AppText weight="900" style={s.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </AppText>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push('/(app)/cart')}
            style={s.iconBtn}
          >
            <Ionicons name="bag-outline" size={20} color={C.text} />
            {cartCount > 0 && (
              <View style={s.badge}>
                <AppText weight="900" style={s.badgeText}>
                  {cartCount > 9 ? '9+' : cartCount}
                </AppText>
              </View>
            )}
          </Pressable>
        </View>

      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  inner: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  // Logo
  logoGroup: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  logoBox: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  logoLetter: { fontSize: 15, color: C.accent, letterSpacing: -0.3 },
  brandName:  { fontSize: 17, color: C.text, letterSpacing: -0.5 },

  // Back button
  backBtn: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },

  // Right icons
  rightGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: C.iconBg,
    borderWidth: 1.5, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },

  // Badge
  badge: {
    position: 'absolute',
    top: -4, right: -4,
    minWidth: 16, height: 16,
    borderRadius: 8,
    backgroundColor: C.red,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5, borderColor: C.surface,
  },
  badgeText: { fontSize: 8, color: '#fff' },
});

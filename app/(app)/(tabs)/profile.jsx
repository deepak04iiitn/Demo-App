import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '../../../components/ui/Screen';
import { AppText } from '../../../components/ui/AppText';
import { useApp } from '../../../context/AppContext';

// ── Brand tokens ──────────────────────────────────────
const C = {
  bg:           '#F5F5F0',
  surface:      '#FFFFFF',
  accentSoft:   '#ECEAFF',
  accent:       '#5B54E8',
  text:         '#1A1A2E',
  textMid:      '#6B6B8A',
  textLight:    '#A8A8C0',
  border:       '#E8E8E2',
  borderAccent: '#C8C5F5',
  green:        '#22C55E',
  greenSoft:    '#DCFCE7',
  red:          '#EF4444',
  redSoft:      '#FEE2E2',
  amberSoft:    '#FEF3C7',
  amber:        '#F59E0B',
};

const MENU = [
  { label: 'Edit Profile',     path: '/(app)/profile/edit',  icon: 'create-outline',       color: C.accent,  bg: C.accentSoft,  border: C.borderAccent },
  { label: 'Settings',         path: '/(app)/settings',      icon: 'settings-outline',     color: C.textMid, bg: '#F0F0EC',     border: C.border },
];

// ── Stat cell ─────────────────────────────────────────
function StatCell({ value, label, border }) {
  return (
    <View style={[stat.cell, border && stat.cellBorder]}>
      <AppText weight="900" style={stat.value}>{value}</AppText>
      <AppText style={stat.label}>{label}</AppText>
    </View>
  );
}
const stat = StyleSheet.create({
  cell:       { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 16 },
  cellBorder: { borderRightWidth: 1, borderRightColor: C.border },
  value:      { fontSize: 22, color: C.text, letterSpacing: -0.6 },
  label:      { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.3 },
});

// ── Menu row ──────────────────────────────────────────
function MenuRow({ item, isLast, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        mr.wrap,
        !isLast && mr.wrapBorder,
        pressed && mr.wrapPressed,
      ]}
    >
      <View style={[mr.iconBox, { backgroundColor: item.bg, borderColor: item.border }]}>
        <Ionicons name={item.icon} size={17} color={item.color} />
      </View>
      <AppText weight="700" style={mr.label}>{item.label}</AppText>
      <View style={mr.chevronBox}>
        <Ionicons name="chevron-forward" size={13} color={C.textLight} />
      </View>
    </Pressable>
  );
}
const mr = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, paddingHorizontal: 18,
  },
  wrapBorder:  { borderBottomWidth: 1, borderBottomColor: C.border },
  wrapPressed: { backgroundColor: '#FAFAF8' },
  iconBox: {
    width: 38, height: 38, borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  label:      { flex: 1, fontSize: 14, color: C.text, letterSpacing: -0.2 },
  chevronBox: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: C.bg,
    alignItems: 'center', justifyContent: 'center',
  },
});

// ── Main screen ───────────────────────────────────────
export default function ProfileScreen() {
  const { state, actions } = useApp();

  const initial     = state.user.name.charAt(0).toUpperCase();
  const orderCount  = state.orders?.length ?? 0;
  const cartCount   = state.cart?.length ?? 0;
  const notifCount  = state.notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <Screen showHeader>
      {/* ── Hero section ── */}
      <View style={s.hero}>
        {/* Avatar */}
        <View style={s.avatarWrap}>
          <View style={s.avatar}>
            <AppText weight="900" style={s.avatarText}>{initial}</AppText>
          </View>
          {/* Online dot */}
          <View style={s.onlineDot} />
        </View>

        <AppText weight="900" style={s.name}>{state.user.name}</AppText>

        <View style={s.occupationRow}>
          <Ionicons name="briefcase-outline" size={12} color={C.textLight} />
          <AppText style={s.occupation}>
            {state.user.occupation} · {state.user.location}
          </AppText>
        </View>

        {state.user.bio ? (
          <AppText style={s.bio}>{state.user.bio}</AppText>
        ) : null}
      </View>

      {/* ── Stats card ── */}
      <View style={s.statsCard}>
        <StatCell value={orderCount} label="Orders"       border />
        <StatCell value={cartCount}  label="In Cart"      border />
        <StatCell value={notifCount} label="Unread" />
      </View>

      {/* ── Menu card ── */}
      <View style={s.menuCard}>
        {MENU.map((item, i) => (
          <MenuRow
            key={item.label}
            item={item}
            isLast={i === MENU.length - 1}
            onPress={() => router.push(item.path)}
          />
        ))}
      </View>

      {/* ── Logout ── */}
      <Pressable
        onPress={async () => {
          await actions.logout();
          router.replace('/(auth)/login');
        }}
        style={({ pressed }) => [s.logoutBtn, pressed && s.logoutBtnPressed]}
      >
        <View style={s.logoutIconBox}>
          <Ionicons name="log-out-outline" size={16} color={C.red} />
        </View>
        <AppText weight="700" style={s.logoutText}>Log out</AppText>
        <Ionicons name="chevron-forward" size={13} color={C.red} style={{ opacity: 0.5 }} />
      </Pressable>
    </Screen>
  );
}

const s = StyleSheet.create({
  // ── Hero ─────────────────────────────────────────────
  hero: {
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  avatarWrap:  { position: 'relative', marginBottom: 4 },
  avatar: {
    width: 88, height: 88,
    borderRadius: 28,
    backgroundColor: C.accentSoft,
    borderWidth: 2.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  avatarText: { fontSize: 36, color: C.accent, letterSpacing: -1 },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: C.green,
    borderWidth: 2.5, borderColor: C.bg,
  },

  name: { fontSize: 24, color: C.text, letterSpacing: -0.7 },

  occupationRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  occupation:    { fontSize: 12, color: C.textLight },

  bio: {
    fontSize: 13, color: C.textMid, textAlign: 'center',
    lineHeight: 19, paddingHorizontal: 32,
  },

  // ── Stats card ───────────────────────────────────────
  statsCard: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 22,
    borderWidth: 1.5, borderColor: C.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6,
    elevation: 1,
  },

  // ── Menu card ────────────────────────────────────────
  menuCard: {
    backgroundColor: C.surface,
    borderRadius: 22,
    borderWidth: 1.5, borderColor: C.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6,
    elevation: 1,
  },

  // ── Logout ───────────────────────────────────────────
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.redSoft,
    borderRadius: 18,
    paddingVertical: 14, paddingHorizontal: 18,
    borderWidth: 1.5, borderColor: '#FCA5A5',
  },
  logoutBtnPressed: { backgroundColor: '#FECACA' },
  logoutIconBox: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  logoutText: { flex: 1, fontSize: 14, color: C.red, letterSpacing: -0.2 },
});
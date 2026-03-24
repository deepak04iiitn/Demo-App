import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppText } from '../../../components/ui/AppText';
import { Screen } from '../../../components/ui/Screen';
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
  amber:        '#F59E0B',
  amberSoft:    '#FEF3C7',
  red:          '#EF4444',
  redSoft:      '#FEE2E2',
  blueSoft:     '#EFF6FF',
  blue:         '#3B82F6',
};

// ── Avatar palette — cycles through distinct hues ─────
const AVATAR_PALETTES = [
  { bg: C.accentSoft,  border: C.borderAccent, color: C.accent },
  { bg: C.greenSoft,   border: '#BBF7D0',       color: C.green },
  { bg: C.amberSoft,   border: '#FDE68A',       color: C.amber },
  { bg: C.blueSoft,    border: '#BFDBFE',       color: C.blue },
  { bg: C.redSoft,     border: '#FECACA',       color: C.red },
];

function getPalette(index) {
  return AVATAR_PALETTES[index % AVATAR_PALETTES.length];
}

// ── Role badge ─────────────────────────────────────────
function RoleBadge({ role }) {
  const isAdmin = role === 'admin';
  return (
    <View style={[rb.wrap, isAdmin ? rb.wrapAdmin : rb.wrapUser]}>
      <Ionicons
        name={isAdmin ? 'shield-checkmark-outline' : 'person-outline'}
        size={10}
        color={isAdmin ? C.accent : C.textMid}
      />
      <AppText weight="800" style={[rb.text, { color: isAdmin ? C.accent : C.textMid }]}>
        {role}
      </AppText>
    </View>
  );
}

const rb = StyleSheet.create({
  wrap:      { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  wrapAdmin: { backgroundColor: C.accentSoft, borderWidth: 1, borderColor: C.borderAccent },
  wrapUser:  { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  text:      { fontSize: 11, letterSpacing: 0.1 },
});

// ── Info pill ──────────────────────────────────────────
function InfoPill({ icon, label, color = C.textMid, bg = C.bg, borderColor = C.border }) {
  return (
    <View style={[ip.wrap, { backgroundColor: bg, borderColor }]}>
      <Ionicons name={icon} size={10} color={color} />
      <AppText weight="600" style={[ip.text, { color }]}>{label}</AppText>
    </View>
  );
}

const ip = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  text: { fontSize: 11 },
});

// ── User card ──────────────────────────────────────────
function UserCard({ user, index }) {
  const [expanded, setExpanded] = useState(false);
  const palette = getPalette(index);
  const initial = user.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      style={({ pressed }) => [uc.wrap, pressed && uc.wrapPressed]}
    >
      {/* ── Top row ── */}
      <View style={uc.topRow}>
        {/* Avatar */}
        <View style={[uc.avatar, { backgroundColor: palette.bg, borderColor: palette.border }]}>
          <AppText weight="900" style={[uc.initial, { color: palette.color }]}>{initial}</AppText>
        </View>

        {/* Name + email */}
        <View style={{ flex: 1 }}>
          <View style={uc.nameRow}>
            <AppText weight="900" style={uc.name}>{user.name}</AppText>
            <RoleBadge role={user.role} />
          </View>
          <AppText style={uc.email}>{user.email}</AppText>
        </View>

        {/* Expand chevron */}
        <View style={uc.chevronBox}>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={13}
            color={C.accent}
          />
        </View>
      </View>

      {/* ── Pills row ── */}
      <View style={uc.pillsRow}>
        {user.occupation && (
          <InfoPill icon="briefcase-outline" label={user.occupation} />
        )}
        {user.location && (
          <InfoPill icon="location-outline" label={user.location} />
        )}
      </View>

      {/* ── Expanded detail ── */}
      {expanded && (
        <>
          <View style={uc.divider} />
          <View style={uc.detailGrid}>
            {user.phone && (
              <View style={uc.detailItem}>
                <View style={[uc.detailIcon, { backgroundColor: C.accentSoft }]}>
                  <Ionicons name="call-outline" size={12} color={C.accent} />
                </View>
                <View>
                  <AppText style={uc.detailLabel}>Phone</AppText>
                  <AppText weight="700" style={uc.detailValue}>{user.phone}</AppText>
                </View>
              </View>
            )}
            {user.joinedAt && (
              <View style={uc.detailItem}>
                <View style={[uc.detailIcon, { backgroundColor: C.greenSoft }]}>
                  <Ionicons name="calendar-outline" size={12} color={C.green} />
                </View>
                <View>
                  <AppText style={uc.detailLabel}>Joined</AppText>
                  <AppText weight="700" style={uc.detailValue}>{user.joinedAt}</AppText>
                </View>
              </View>
            )}
            {user.orders != null && (
              <View style={uc.detailItem}>
                <View style={[uc.detailIcon, { backgroundColor: C.amberSoft }]}>
                  <Ionicons name="bag-outline" size={12} color={C.amber} />
                </View>
                <View>
                  <AppText style={uc.detailLabel}>Orders</AppText>
                  <AppText weight="700" style={uc.detailValue}>{user.orders}</AppText>
                </View>
              </View>
            )}
            {user.id && (
              <View style={uc.detailItem}>
                <View style={[uc.detailIcon, { backgroundColor: C.blueSoft }]}>
                  <Ionicons name="fingerprint-outline" size={12} color={C.blue} />
                </View>
                <View>
                  <AppText style={uc.detailLabel}>User ID</AppText>
                  <AppText weight="700" style={uc.detailValue} numberOfLines={1}>{user.id}</AppText>
                </View>
              </View>
            )}
          </View>
        </>
      )}
    </Pressable>
  );
}

const uc = StyleSheet.create({
  wrap: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    gap: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: '#5B54E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  wrapPressed: { backgroundColor: '#FAFAF8', transform: [{ scale: 0.99 }] },

  topRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 48, height: 48, borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  initial: { fontSize: 19, letterSpacing: -0.5 },

  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 },
  name:    { fontSize: 15, color: C.text, letterSpacing: -0.3 },
  email:   { fontSize: 11, color: C.textLight },

  chevronBox: {
    width: 28, height: 28, borderRadius: 9,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },

  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },

  divider: { height: 1, backgroundColor: C.border },

  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 9, width: '45%' },
  detailIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  detailLabel: { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.3 },
  detailValue: { fontSize: 13, color: C.text, letterSpacing: -0.2, marginTop: 1 },
});

// ── Summary strip ─────────────────────────────────────
function SummaryStrip({ users }) {
  const total  = users.length;
  const admins = users.filter((u) => u.role === 'admin').length;
  const locs   = new Set(users.map((u) => u.location).filter(Boolean)).size;

  const stats = [
    { label: 'Users',     value: total,  icon: 'people-outline',        color: C.accent, bg: C.accentSoft },
    { label: 'Admins',    value: admins, icon: 'shield-checkmark-outline', color: C.green,  bg: C.greenSoft },
    { label: 'Locations', value: locs,   icon: 'location-outline',      color: C.amber,  bg: C.amberSoft },
  ];

  return (
    <View style={ss.wrap}>
      {stats.map((s, i) => (
        <View key={s.label} style={[ss.cell, i < 2 && ss.cellBorder]}>
          <View style={[ss.iconWrap, { backgroundColor: s.bg }]}>
            <Ionicons name={s.icon} size={13} color={s.color} />
          </View>
          <AppText weight="900" style={ss.value}>{s.value}</AppText>
          <AppText style={ss.label}>{s.label}</AppText>
        </View>
      ))}
    </View>
  );
}

const ss = StyleSheet.create({
  wrap: {
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
  cell:       { flex: 1, alignItems: 'center', paddingVertical: 16, gap: 5 },
  cellBorder: { borderRightWidth: 1, borderRightColor: C.border },
  iconWrap:   { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  value:      { fontSize: 18, color: C.text, letterSpacing: -0.5 },
  label:      { fontSize: 10, color: C.textLight, fontWeight: '600', letterSpacing: 0.3 },
});

// ── Main screen ───────────────────────────────────────
export default function AdminUsersScreen() {
  const { state } = useApp();

  return (
    <Screen>
      {/* ── Page header ── */}
      <View style={s.pageHeader}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={18} color={C.accent} />
        </Pressable>
        <View style={s.titleWrap}>
          <AppText weight="900" style={s.pageTitle}>User Directory</AppText>
          <AppText style={s.pageSubtitle}>All registered accounts</AppText>
        </View>
        {state.users.length > 0 && (
          <View style={s.countBadge}>
            <AppText weight="800" style={s.countText}>{state.users.length}</AppText>
          </View>
        )}
      </View>

      {/* ── Summary strip ── */}
      {state.users.length > 0 && <SummaryStrip users={state.users} />}

      {/* ── User list ── */}
      {state.users.length === 0 ? (
        <View style={s.emptyWrap}>
          <View style={s.emptyIconCircle}>
            <Ionicons name="people-outline" size={30} color={C.accent} />
          </View>
          <AppText weight="800" style={s.emptyTitle}>No users yet</AppText>
          <AppText style={s.emptyDesc}>Registered users will appear here.</AppText>
        </View>
      ) : (
        state.users.map((user, i) => (
          <UserCard key={user.id} user={user} index={i} />
        ))
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  titleWrap:    { flex: 1 },
  pageTitle:    { fontSize: 30, color: C.text, letterSpacing: -1, lineHeight: 33 },
  pageSubtitle: { fontSize: 13, color: C.textLight, marginTop: 3 },
  countBadge: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  countText: { fontSize: 15, color: C.accent },

  emptyWrap: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40, gap: 12 },
  emptyIconCircle: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: C.accentSoft,
    borderWidth: 1.5, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 20, color: C.text, letterSpacing: -0.4 },
  emptyDesc:  { fontSize: 13, color: C.textLight, textAlign: 'center', lineHeight: 20 },
});
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppText } from '../../components/ui/AppText';
import { Screen } from '../../components/ui/Screen';
import { useApp } from '../../context/AppContext';

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
  red:          '#EF4444',
  redSoft:      '#FEE2E2',
  amber:        '#F59E0B',
  amberSoft:    '#FEF3C7',
  greenSoft:    '#DCFCE7',
  green:        '#22C55E',
};

const LANGUAGES = [
  { id: 'English', flag: '🇺🇸' },
  { id: 'Spanish', flag: '🇪🇸' },
  { id: 'French',  flag: '🇫🇷' },
];

// ── Toggle row ─────────────────────────────────────────
function ToggleCard({ icon, iconBg, iconColor, title, subtitle, value, onValueChange }) {
  return (
    <View style={tc.wrap}>
      <View style={tc.left}>
        <View style={[tc.iconBox, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={15} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="900" style={tc.title}>{title}</AppText>
          <AppText style={tc.sub}>{subtitle}</AppText>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor="#fff"
        trackColor={{ true: C.accent, false: C.border }}
        ios_backgroundColor={C.border}
      />
    </View>
  );
}

const tc = StyleSheet.create({
  wrap: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: '#5B54E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  left:    { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  title:   { fontSize: 14, color: C.text, letterSpacing: -0.2, marginBottom: 2 },
  sub:     { fontSize: 11, color: C.textLight, lineHeight: 16 },
});

// ── Language card ──────────────────────────────────────
function LanguageCard({ selected, onSelect }) {
  return (
    <View style={lc.wrap}>
      <View style={lc.headerRow}>
        <View style={lc.iconBox}>
          <Ionicons name="globe-outline" size={15} color={C.accent} />
        </View>
        <AppText weight="900" style={lc.title}>Language</AppText>
      </View>
      <View style={lc.divider} />
      <View style={lc.chipsRow}>
        {LANGUAGES.map((lang) => {
          const active = selected === lang.id;
          return (
            <Pressable
              key={lang.id}
              onPress={() => onSelect(lang.id)}
              style={[lc.chip, active && lc.chipActive]}
            >
              <AppText style={lc.flag}>{lang.flag}</AppText>
              <AppText weight="700" style={[lc.chipText, active && lc.chipTextActive]}>
                {lang.id}
              </AppText>
              {active && (
                <View style={lc.checkDot}>
                  <Ionicons name="checkmark" size={9} color="#fff" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const lc = StyleSheet.create({
  wrap: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: '#5B54E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: {
    width: 40, height: 40, borderRadius: 13,
    backgroundColor: C.accentSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  title:   { fontSize: 14, color: C.text, letterSpacing: -0.2 },
  divider: { height: 1, backgroundColor: C.border },
  chipsRow: { flexDirection: 'row', gap: 10 },
  chip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: C.bg,
    borderWidth: 1.5, borderColor: C.border,
  },
  chipActive:     { backgroundColor: C.accentSoft, borderColor: C.borderAccent },
  flag:           { fontSize: 14 },
  chipText:       { fontSize: 12, color: C.textMid },
  chipTextActive: { color: C.accent },
  checkDot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: C.accent,
    alignItems: 'center', justifyContent: 'center',
  },
});

// ── Danger section ─────────────────────────────────────
function DangerCard({ onDelete }) {
  return (
    <View style={dc.wrap}>
      <View style={dc.headerRow}>
        <View style={dc.iconBox}>
          <Ionicons name="warning-outline" size={15} color={C.red} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="900" style={dc.title}>Danger Zone</AppText>
          <AppText style={dc.sub}>These actions are permanent and cannot be undone.</AppText>
        </View>
      </View>
      <View style={dc.divider} />
      <Pressable onPress={onDelete} style={({ pressed }) => [dc.btn, pressed && { opacity: 0.88 }]}>
        <Ionicons name="trash-outline" size={15} color={C.red} />
        <AppText weight="800" style={dc.btnText}>Delete Account</AppText>
      </Pressable>
    </View>
  );
}

const dc = StyleSheet.create({
  wrap: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    shadowColor: C.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 40, height: 40, borderRadius: 13,
    backgroundColor: C.redSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  title:   { fontSize: 14, color: C.red, letterSpacing: -0.2, marginBottom: 2 },
  sub:     { fontSize: 11, color: C.textLight, lineHeight: 16 },
  divider: { height: 1, backgroundColor: '#FECACA' },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    backgroundColor: C.redSoft,
    borderWidth: 1.5, borderColor: '#FECACA',
    borderRadius: 14, paddingVertical: 14,
  },
  btnText: { fontSize: 14, color: C.red, letterSpacing: -0.2 },
});

// ── Main screen ───────────────────────────────────────
export default function SettingsScreen() {
  const { state, actions } = useApp();

  return (
    <Screen>
      {/* ── Header ── */}
      <View style={s.pageHeader}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={18} color={C.accent} />
        </Pressable>
        <View style={s.titleWrap}>
          <AppText weight="900" style={s.pageTitle}>Settings</AppText>
          <AppText style={s.pageSubtitle}>Preferences &amp; account</AppText>
        </View>
      </View>

      <ToggleCard
        icon="moon-outline"
        iconBg={C.accentSoft}
        iconColor={C.accent}
        title="Dark Mode"
        subtitle="Switch between light and dark premium themes."
        value={state.themeMode === 'dark'}
        onValueChange={actions.toggleTheme}
      />

      <ToggleCard
        icon="notifications-outline"
        iconBg={C.amberSoft}
        iconColor={C.amber}
        title="Notifications"
        subtitle="Receive mock order updates and offers."
        value={state.settings.notifications}
        onValueChange={actions.toggleNotifications}
      />

      <LanguageCard
        selected={state.language}
        onSelect={actions.setLanguage}
      />

      <DangerCard
        onDelete={async () => {
          await actions.deleteAccount();
          router.replace('/(auth)/login');
        }}
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  pageHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 8, paddingBottom: 4 },
  backBtn: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  titleWrap:    { flex: 1 },
  pageTitle:    { fontSize: 30, color: C.text, letterSpacing: -1, lineHeight: 33 },
  pageSubtitle: { fontSize: 13, color: C.textLight, marginTop: 3 },
});
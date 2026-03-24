import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppInput } from '../../../components/forms/AppInput';
import { AppText } from '../../../components/ui/AppText';
import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';

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
};

const AVATAR_PALETTES = [
  { bg: C.accentSoft,  border: C.borderAccent, color: C.accent },
  { bg: C.greenSoft,   border: '#BBF7D0',      color: C.green  },
];

const FIELDS = [
  { key: 'name',       label: 'Full Name',   icon: 'person-outline',    keyboard: 'default',        cap: 'words' },
  { key: 'email',      label: 'Email',       icon: 'mail-outline',      keyboard: 'email-address',  cap: 'none'  },
  { key: 'location',   label: 'Location',    icon: 'location-outline',  keyboard: 'default',        cap: 'words' },
  { key: 'occupation', label: 'Occupation',  icon: 'briefcase-outline', keyboard: 'default',        cap: 'words' },
  { key: 'bio',        label: 'Bio',         icon: 'create-outline',    keyboard: 'default',        cap: 'sentences', multiline: true },
];

export default function EditProfileScreen() {
  const { state, actions } = useApp();
  const [form, setForm] = useState(state.user);
  const palette = AVATAR_PALETTES[0];
  const initial = form.name?.charAt(0).toUpperCase() ?? '?';

  const save = () => {
    actions.updateProfile(form);
    router.back();
  };

  return (
    <Screen>
      {/* ── Header ── */}
      <View style={s.pageHeader}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={18} color={C.accent} />
        </Pressable>
        <View style={s.titleWrap}>
          <AppText weight="900" style={s.pageTitle}>Edit Profile</AppText>
          <AppText style={s.pageSubtitle}>Update your personal details</AppText>
        </View>
      </View>

      {/* ── Avatar section ── */}
      <View style={s.avatarSection}>
        <View style={[s.avatarRing, { borderColor: palette.border }]}>
          <View style={[s.avatar, { backgroundColor: palette.bg }]}>
            <AppText weight="900" style={[s.initial, { color: palette.color }]}>{initial}</AppText>
          </View>
        </View>
        <Pressable
          onPress={() => actions.updateProfile({ avatar: `mock-avatar-${Date.now()}` })}
          style={s.changePicBtn}
        >
          <Ionicons name="camera-outline" size={13} color={C.accent} />
          <AppText weight="700" style={s.changePicText}>Change Picture</AppText>
        </Pressable>
      </View>

      {/* ── Fields card ── */}
      <View style={s.fieldsCard}>
        <View style={s.cardHeader}>
          <View style={s.cardIconBox}>
            <Ionicons name="person-circle-outline" size={14} color={C.accent} />
          </View>
          <AppText weight="900" style={s.cardTitle}>Personal Info</AppText>
        </View>
        <View style={s.divider} />
        <View style={s.fields}>
          {FIELDS.map((field, i) => (
            <View key={field.key}>
              <View style={s.fieldRow}>
                <View style={s.fieldIconBox}>
                  <Ionicons name={field.icon} size={13} color={C.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppInput
                    label={field.label}
                    value={form[field.key] ?? ''}
                    onChangeText={(val) => setForm((p) => ({ ...p, [field.key]: val }))}
                    keyboardType={field.keyboard}
                    autoCapitalize={field.cap}
                    multiline={field.multiline}
                  />
                </View>
              </View>
              {i < FIELDS.length - 1 && <View style={s.fieldDivider} />}
            </View>
          ))}
        </View>
      </View>

      {/* ── Save CTA ── */}
      <Pressable
        onPress={save}
        style={({ pressed }) => [s.cta, pressed && { opacity: 0.88 }]}
      >
        <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
        <AppText weight="800" style={s.ctaText}>Save Changes</AppText>
      </Pressable>
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

  // Avatar
  avatarSection: { alignItems: 'center', gap: 14, paddingVertical: 8 },
  avatarRing: {
    width: 96, height: 96, borderRadius: 30,
    borderWidth: 2, padding: 3,
  },
  avatar:  { flex: 1, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  initial: { fontSize: 36, letterSpacing: -1 },
  changePicBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
  },
  changePicText: { fontSize: 12, color: C.accent },

  // Fields card
  fieldsCard: {
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
  cardHeader:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIconBox: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: C.accentSoft,
    borderWidth: 1, borderColor: C.borderAccent,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, color: C.text, letterSpacing: -0.3 },
  divider:   { height: 1, backgroundColor: C.border },
  fields:    { gap: 4 },
  fieldRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  fieldIconBox: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: C.accentSoft,
    marginTop: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  fieldDivider: { height: 1, backgroundColor: C.border, marginLeft: 42 },

  // CTA
  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    backgroundColor: C.accent,
    borderRadius: 18, paddingVertical: 16,
    marginTop: 4,
  },
  ctaText: { fontSize: 15, color: '#fff', letterSpacing: -0.3 },
});
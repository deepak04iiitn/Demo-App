import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppButton } from '../../../components/ui/AppButton';
import { AppText } from '../../../components/ui/AppText';
import { AppInput } from '../../../components/forms/AppInput';
import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';
import { useAppTheme } from '../../../hooks/useAppTheme';

export default function EditProfileScreen() {
  const { state, actions } = useApp();
  const { colors } = useAppTheme();
  const [form, setForm] = useState(state.user);

  const save = () => {
    actions.updateProfile(form);
    router.back();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.back, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="arrow-back" size={18} color={colors.text} />
        </Pressable>
        <AppText variant="h1" weight="900">
          Edit Profile
        </AppText>
      </View>
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <AppText variant="h1" weight="900" style={{ color: '#fff' }}>
            {form.name.charAt(0)}
          </AppText>
        </View>
        <AppButton label="Change Picture" variant="secondary" onPress={() => actions.updateProfile({ avatar: `mock-avatar-${Date.now()}` })} />
      </View>
      <AppInput label="Name" value={form.name} onChangeText={(name) => setForm((prev) => ({ ...prev, name }))} />
      <AppInput label="Email" value={form.email} onChangeText={(email) => setForm((prev) => ({ ...prev, email }))} keyboardType="email-address" autoCapitalize="none" />
      <AppInput label="Location" value={form.location} onChangeText={(location) => setForm((prev) => ({ ...prev, location }))} />
      <AppInput label="Occupation" value={form.occupation} onChangeText={(occupation) => setForm((prev) => ({ ...prev, occupation }))} />
      <AppInput label="Bio" value={form.bio} onChangeText={(bio) => setForm((prev) => ({ ...prev, bio }))} multiline />
      <AppButton label="Save Changes" onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: { width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarSection: { alignItems: 'center', gap: 12 },
  avatar: { width: 88, height: 88, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});

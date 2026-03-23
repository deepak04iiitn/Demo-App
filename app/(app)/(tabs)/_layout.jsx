import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../../../hooks/useAppTheme';

export default function TabsLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 72,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSoft,
      }}>
      {[
        ['home', 'Home', 'home-outline', 'home'],
        ['catalog', 'Browse', 'grid-outline', 'grid'],
        ['orders', 'Orders', 'cube-outline', 'cube'],
        ['notifications', 'Alerts', 'notifications-outline', 'notifications'],
        ['profile', 'Profile', 'person-outline', 'person'],
      ].map(([name, title, icon, focusedIcon]) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? focusedIcon : icon} size={22} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}

import { Redirect } from 'expo-router';

import { useApp } from '../context/AppContext';

export default function Index() {
  const { state } = useApp();

  if (!state.isHydrated) {
    return null;
  }

  if (!state.isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(app)/(tabs)/home" />;
}

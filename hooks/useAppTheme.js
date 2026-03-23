import { useMemo } from 'react';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import { palettes } from '../constants/theme';
import { useApp } from '../context/AppContext';

export function useAppTheme() {
  const { state } = useApp();

  return useMemo(() => {
    const colors = palettes[state.themeMode];
    const navTheme = state.themeMode === 'dark' ? DarkTheme : DefaultTheme;

    return {
      mode: state.themeMode,
      colors,
      navigationTheme: {
        ...navTheme,
        colors: {
          ...navTheme.colors,
          background: colors.background,
          card: colors.surface,
          primary: colors.primary,
          text: colors.text,
          border: colors.border,
          notification: colors.accent,
        },
      },
    };
  }, [state.themeMode]);
}

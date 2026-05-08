import '@/global.css';

import { BookmarksProvider } from '@/lib/bookmarks';
import { NAV_THEME } from '@/lib/theme';
import {
  NotoSansTC_100Thin,
  NotoSansTC_200ExtraLight,
  NotoSansTC_300Light,
  NotoSansTC_400Regular,
  NotoSansTC_500Medium,
  NotoSansTC_600SemiBold,
  NotoSansTC_700Bold,
  NotoSansTC_800ExtraBold,
  NotoSansTC_900Black,
} from '@expo-google-fonts/noto-sans-tc';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as React from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSansTC_100Thin,
    NotoSansTC_200ExtraLight,
    NotoSansTC_300Light,
    NotoSansTC_400Regular,
    NotoSansTC_500Medium,
    NotoSansTC_600SemiBold,
    NotoSansTC_700Bold,
    NotoSansTC_800ExtraBold,
    NotoSansTC_900Black,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <BookmarksProvider>
      <ThemeProvider value={NAV_THEME.light}>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="bookmark" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
        <PortalHost />
      </ThemeProvider>
    </BookmarksProvider>
  );
}

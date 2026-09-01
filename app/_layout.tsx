import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import {
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="splash" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="symptoms" />
          <Stack.Screen name="health-tips" />
          <Stack.Screen name="appointments" />
          <Stack.Screen name="order-medicine" />
          <Stack.Screen name="book-diagnostics" />
          <Stack.Screen name="health-records" />
          <Stack.Screen name="emergency" />
          <Stack.Screen name="ai-analysis" />
          <Stack.Screen name="body-part-detail" />
          <Stack.Screen name="reminders" />
          <Stack.Screen name="insurance" />
          <Stack.Screen name="health-score" />
          <Stack.Screen name="elderly-care" />
          <Stack.Screen name="chat" />
          <Stack.Screen name="waiting-room" />
          <Stack.Screen name="profile/index" />
          <Stack.Screen name="profile/[type]" />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

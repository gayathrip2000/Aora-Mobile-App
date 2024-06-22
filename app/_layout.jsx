import { StyleSheet, Text, View } from 'react-native';
import { Slot, Stack } from 'expo-router';

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Slot />
    </Stack>
  );
}

export default RootLayout;
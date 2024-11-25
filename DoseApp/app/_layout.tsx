import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="enter_user_details"/>
      <Stack.Screen name="major_backEnd"/>
    </Stack>
  );
}

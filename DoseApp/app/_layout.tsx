import { Stack } from "expo-router";
import { PillDetailsProvider } from "./PillDetailsContext"; // Import your context provider

export default function RootLayout() {
  return (
    <PillDetailsProvider>

    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="enter_user_details"/>
      <Stack.Screen name="major_backEnd" options={{ headerShown: false }}/>
      <Stack.Screen name="PillDetailsContext"/>
      <Stack.Screen name="About"/>
    </Stack>
    </PillDetailsProvider>

  );
}

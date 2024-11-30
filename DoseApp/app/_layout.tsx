import { Stack } from "expo-router";
import { PillDetailsProvider } from "./PillDetailsContext"; // Import your context provider
import { BluetoothProvider } from "./bluetooth_context";

export default function RootLayout() {
  return (
    <PillDetailsProvider>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="enter_user_details" options={{ title: 'My Pills ' }}/>
      <Stack.Screen name="major_backEnd" options={{ title: 'Home' }}/>
      <Stack.Screen name="PillDetailsContext" />
      <Stack.Screen name="About"/>
      <Stack.Screen name="login"/>
    </Stack>
    </PillDetailsProvider>

  );
}

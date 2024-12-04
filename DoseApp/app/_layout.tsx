import { Stack } from "expo-router";
import { PillDetailsProvider } from "./PillDetailsContext"; // Import your context provider
import BluetoothProvider from "./BLEContext";
import { Button } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import { Provider as PaperProvider } from 'react-native-paper';
import HeaderWithMenu from './HeaderMenu'; // Adjust path accordingly


export default function RootLayout() {


  const handleLogout = async() => {
    await AsyncStorage.removeItem('isLoggedIn'); // Clear login status
    Alert.alert('Logged out', 'You have been logged out successfully.');
    router.replace("./login"); // Redirect to login page
  };
  const router = useRouter();


  return (
    <PaperProvider>
    <BluetoothProvider>
    <PillDetailsProvider>
    <HeaderWithMenu />
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="enter_user_details" options={{ title: 'My Pills ', headerBackVisible: false, gestureEnabled: false, }}/>
      <Stack.Screen name="major_backEnd" options={{ title: 'Home',  headerBackVisible: false, gestureEnabled: false,  }}/>
      <Stack.Screen name="PillDetailsContext" />
      <Stack.Screen name="About"/>
      <Stack.Screen name="login" options={{ title: 'Login', headerBackVisible: false, gestureEnabled: false, }}/>
    </Stack>
    </PillDetailsProvider>
    </BluetoothProvider>
    </PaperProvider>

  );
}

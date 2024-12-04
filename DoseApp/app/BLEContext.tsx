
import React, { createContext, useState, useRef, useEffect } from "react";
import { BleManager, Device, BleError } from "react-native-ble-plx";
import { atob, btoa } from "react-native-quick-base64";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import ConfettiCannon from 'react-native-confetti-cannon';

const BluetoothContext = createContext();
const bleManager = new BleManager();
const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
const CHARACTERISTIC_UUID = "12345678-1234-5678-1234-56789abcdef1";

const BluetoothProvider = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [device, setDevice] = useState(null);
  const deviceRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Function to start scanning and connect to the ESP32
  const searchAndConnectToDevice = () => {
    bleManager.startDeviceScan(null, null, async (error, discoveredDevice) => {
      if (error) {
        console.error(error);
        setConnectionStatus("Error scanning");
        return;
      }
      if (discoveredDevice.name === "ESP32") {
        bleManager.stopDeviceScan();
        await connectToDevice(discoveredDevice);
      }
    });
  };

  // Function to connect to a device
  const connectToDevice = async (device) => {
    try {
      await device.connect();
      setDevice(device);
      deviceRef.current = device;
      setConnectionStatus("Connected");
      await device.discoverAllServicesAndCharacteristics();
      await AsyncStorage.setItem('connectedDevice', device.id); // Save device ID for reconnection
      console.log("Device connected and saved for future reconnects");
    } catch (error) {
      console.error("Connection error:", error);
      setConnectionStatus("Error in Connection");
      searchAndConnectToDevice();
    }
  };

  // Function to attempt reconnection to last connected device
  const reconnectToLastDevice = async () => {
    const deviceId = await AsyncStorage.getItem('connectedDevice');
    if (deviceId) {
      console.log("Found saved device ID:", deviceId);
      try {
        // Try to reconnect using the saved device ID
        const lastDevice = await bleManager.connectToDevice(deviceId);
        if (lastDevice) {
          await connectToDevice(lastDevice); // If device found, connect
        } else {
          console.log("Reconnection failed. Starting scan...");
          searchAndConnectToDevice(); // Start scanning if connection fails
        }
      } catch (error) {
        console.log("Reconnection error:", error);
        searchAndConnectToDevice(); // Attempt scanning again on error
      }
    } else {
      console.log("No saved device found. Starting scan...");
      searchAndConnectToDevice(); // If no saved device, start scanning
    }
  };

  // Function to send data to the connected device
  const sendData = async (data, repetitions = 1) => {
    if (!deviceRef.current) {
      console.error("No connected device");
      return;
    }
    try {
      for (let i = 0; i < repetitions; i++) {
        const encodedData = btoa(data);
        console.log(`Sending data (${i + 1}/${repetitions}):`, data);
        await deviceRef.current.writeCharacteristicWithResponseForService(
          SERVICE_UUID,
          CHARACTERISTIC_UUID,
          encodedData
        );
        console.log(`Data sent to ESP32 (${i + 1}/${repetitions})`);

        if (i < repetitions - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay between send
        }
      }
      if (data !== "6") {
        showAlert();
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // Function to show an alert and handle the "OK" press
  const showAlert = () => {

    Alert.alert(
      "Pill Dispensed",
      "Don't forget to pick it up :)",
      [
        {
          text: "Done",
          onPress: () => {
            setShowConfetti(true);  // Trigger the confetti
            console.log("User pressed OK. Sending another signal...");
            sendData("6");  // Send another signal after the user presses OK
             // Stop the confetti after 1 second
        setTimeout(() => {
            setShowConfetti(false);
          }, 1000); // 1000 milliseconds = 1 second
          }
        }
      ]
    );
  };

  // Monitoring connection state and auto-reconnection
  useEffect(() => {
    reconnectToLastDevice(); // Try reconnecting when the app is opened

    // Handling disconnection events
    const handleDeviceDisconnected = async (deviceIdentifier: string) => {
      console.log("Device disconnected, attempting to reconnect...");
      setConnectionStatus("Disconnected");
      searchAndConnectToDevice(); // Call your function to reconnect
    };

    // Listen for disconnection event and subscribe
    const subscription = bleManager.onDeviceDisconnected(
      "ESP32",  // Add the device identifier (for example, the device ID of ESP32)
      handleDeviceDisconnected
    );

    // Cleanup: Cancel connection when the component is unmounted
    return () => {
      if (deviceRef.current) {
        deviceRef.current.cancelConnection();
        AsyncStorage.removeItem('connectedDevice'); // Optionally remove the device ID on disconnect
      }
      // Remove event listeners on cleanup
      subscription.remove();
    };
  }, []);

  return (
    <BluetoothContext.Provider value={{ connectionStatus, sendData }}>
      {children}
      {showConfetti && (
        <ConfettiCannon 
        count={200} 
        origin={{ x: 0, y: 0 }} 
        fadeOut={true} 
        explosionSpeed={300} // Adjust explosion speed (higher makes confetti burst faster)
        fallSpeed={500} // Simulate faster fall (not officially supported in the library)
      />
      )}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => React.useContext(BluetoothContext);

export default BluetoothProvider;

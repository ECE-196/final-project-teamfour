import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Button, Text, Alert, ScrollView, StyleSheet } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import PillDetailsContext from "./PillDetailsContext";
import { useRouter } from "expo-router";


const bleManager = new BleManager();
const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
const CHARACTERISTIC_UUID = "12345678-1234-5678-1234-56789abcdef1";

export default function BackEnd() {
  const router = useRouter();

  const [deviceID, setDeviceID] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Searching....");
  const connectionStatusRef = useRef(connectionStatus);
  const deviceRef = useRef<Device | null>(null);

  // Use the context with a check to ensure we're inside the provider
  const context = useContext(PillDetailsContext);

  // Throw an error if the context is undefined (meaning the provider is not used)
  if (!context) {
    throw new Error("PillDetailsContext must be used within a PillDetailsProvider");
  }

  const { pillDetails, savePillDetails } = context;

  const [currentTime, setCurrentTime] = useState("");

  // Transform pillDetails to an easily accessible format for time comparison
  const TargetTime_from_user = pillDetails.map(({ pillName, time, slot, dosage }) => {
    const [hour, minute, second] = time.split(":").map(Number);
    return { pillName, time, slot, dosage, hour, minute, second };
  });

  const searchAndConnectToDevice = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        setConnectionStatus("Error searching for devices");
        return;
      }

      if (device.name === "ESP32") {
        bleManager.stopDeviceScan();
        setConnectionStatus("Connecting...");
        connectionStatusRef.current = "Connected";
        connectToDevice(device);
      }
    });
  };

  const connectToDevice = async (device) => {
    try {
      await device.connect();
      setDeviceID(device.id);
      setConnectionStatus("Connected");
      deviceRef.current = device;

      await device.discoverAllServicesAndCharacteristics();
    } catch (error) {
      console.log(error);
      setConnectionStatus("Error in Connection");
      searchAndConnectToDevice();
    }
  };

  const sendData = async (data, repetitions = 1) => {
    if (!deviceRef.current) {
      console.log("Device is not available for sending data.");
      return;
    }

    if (connectionStatusRef.current !== "Connected") {
      console.log("Attempting to reconnect...");
      await connectToDevice(deviceRef.current);
      if (connectionStatusRef.current !== "Connected") {
        console.log("Unable to reconnect to the device.");
        return;
      }
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
          await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
        }
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  useEffect(() => {
    searchAndConnectToDevice();

    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formattedTime);

      TargetTime_from_user.forEach(({ pillName, time, slot, dosage, hour, minute, second }) => {
        if (now.getHours() === hour && now.getMinutes() === minute && now.getSeconds() === second) {
          console.log(`The time is now ${formattedTime}. Sending data to ESP32 for slot ${slot}.`);
          sendData(slot, parseInt(dosage, 10)); // Sending data based on dosage
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [pillDetails]);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Pill Details</Text>
      </View>

      <View style={styles.pillHeader}>
        <Text style={styles.pillHeaderText}>Pill Name</Text>
        <Text style={styles.pillHeaderText}>Time</Text>
        <Text style={styles.pillHeaderText}>Slot</Text>
        <Text style={styles.pillHeaderText}>Dosage</Text>
      </View>

      {pillDetails.map(({ pillName, time, slot, dosage }, index) => (
        <View key={index} style={styles.pillDetailRow}>
          <Text style={styles.pillDetailText}>{pillName}</Text>
          <Text style={styles.pillDetailText}>{time}</Text>
          <Text style={styles.pillDetailText}>{slot}</Text>
          <Text style={styles.pillDetailText}>{dosage}</Text>
        </View>
      ))}

        <Button
              title=" Edit Pill Details"
              onPress={() => router.push("./enter_user_details")} // Navigate to /enter_user_details
            />

      <View style={styles.currentTimeContainer}>
        <Text style={styles.currentTimeText}>Current Time:</Text>
        <Text style={styles.timeText}>{currentTime}</Text>
        <Text>{connectionStatus}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Turn ON LED" onPress={() => sendData("1")} />
        <Button title="TIME" onPress={() => sendData("2")} />
        <Button title="Turn OFF LED" onPress={() => sendData("0")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  pillHeader: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderBottomWidth: 1,
  },
  pillHeaderText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  pillDetailRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  pillDetailText: {
    flex: 1,
    textAlign: "center",
  },
  currentTimeContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  currentTimeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

import { BleManager, Device } from "react-native-ble-plx";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { View, Button, Text, Alert } from "react-native";
import { atob, btoa } from "react-native-quick-base64";



const bleManager = new BleManager();
const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
const CHARACTERISTIC_UUID = "12345678-1234-5678-1234-56789abcdef1";

export default function back_end() {
  const [deviceID, setDeviceID] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Searching....");
  // const deviceRef = useRef(null);
  const connectionStatusRef = useRef(connectionStatus);
  const deviceRef = useRef<Device | null>(null); // Correctly typing the ref

  
  const [currentTime, setCurrentTime] = useState("");
  const targetTime1 = { hour: 21, minute: 54, second: 0 }; // Example: 14:30:00 (2:30 PM)
  const targetTime2 = { hour: 10, minute: 19, second: 40 }; // Example: 14:30:00 (2:30 PM)
  const targetTime3 = { hour: 21, minute: 58, second: 0 }; // Example: 14:30:00 (2:30 PM)
  const targetTime4 = { hour: 21, minute: 58, second: 0 }; // Example: 14:30:00 (2:30 PM)

  const searchAndConnectToDevice = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        setConnectionStatus("Error searching for devices");
        return;
      }
  
      // Log each device discovered
  
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
      await device.connect();  // Wait for the connection to complete
      setDeviceID(device.id);
      setConnectionStatus("Connected");
      deviceRef.current = device;
  
      // Discover services and characteristics after the connection is established
      await device.discoverAllServicesAndCharacteristics();
      return connectionStatus;
    } catch (error) {
      console.log(error);
      setConnectionStatus("Error in Connection");
      searchAndConnectToDevice();
    }
  };
  
  const sendData = async (data) => {
    
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
      const encodedData = btoa(data); // Convert string to Base64
      console.log("Preparing to send data:", data);
      // console.log("Device reference:", deviceRef.current);
      // console.log("Connection status:", connectionStatus);

      await deviceRef.current.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        encodedData
      );
      console.log("Data sent to ESP32");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  useEffect(() => { 
    searchAndConnectToDevice();
    //Update the time every second
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formattedTime);
      console.log(connectionStatusRef.current); 
      //Check if the current time matches the target time (hour, minute, and second)
      if (
        //FIRST MOTOR--2
        now.getHours() === targetTime1.hour &&
        now.getMinutes() === targetTime1.minute &&
        now.getSeconds() === targetTime1.second
      ) {
        console.log(`The time is now ${formattedTime}. Sending data to ESP32.`);
       
        sendData("2"); // Replace with the data you want to send
      }
      if (
        //SECOND MOTOR--3
        now.getHours() === targetTime2.hour &&
        now.getMinutes() === targetTime2.minute &&
        now.getSeconds() === targetTime2.second
      ) {
        console.log(`The time is now ${formattedTime}. Sending data to ESP32.`);
       
        sendData("3"); // Replace with the data you want to send
      }
      if (
        //THIRD MOTOR--4
        now.getHours() === targetTime3.hour &&
        now.getMinutes() === targetTime3.minute &&
        now.getSeconds() === targetTime3.second
      ) {
        console.log(`The time is now ${formattedTime}. Sending data to ESP32.`);
       
        sendData("4"); // Replace with the data you want to send
      }
      if (
        //FOURTH MOTOR--5
        now.getHours() === targetTime4.hour &&
        now.getMinutes() === targetTime4.minute &&
        now.getSeconds() === targetTime4.second
      ) {
        console.log(`The time is now ${formattedTime}. Sending data to ESP32.`);
       
        sendData("5"); // Replace with the data you want to send
      }
      //will this work for multiple of the same time????????????? yesss
     }, 1000);

    return () => {
      clearInterval(interval);
    };
   }, []);


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Current Time:</Text>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>{currentTime}</Text>
      <Text> {connectionStatus}</Text>
      <Button title="Turn ON LED" onPress={() => sendData("1")} />
      <Button title=" TIME" onPress={() => sendData("2")} />
      <Button title="Turn OFF LED" onPress={() => sendData("0")} />
    </View>
  );
}

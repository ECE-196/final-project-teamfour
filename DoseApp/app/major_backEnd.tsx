import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Button, Text, ScrollView, StyleSheet, Image } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import PillDetailsContext from "./PillDetailsContext";
import { useRouter } from "expo-router";
import { atob, btoa } from "react-native-quick-base64";

const bleManager = new BleManager();
const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
const CHARACTERISTIC_UUID = "12345678-1234-5678-1234-56789abcdef1";

export default function BackEnd() {
  const router = useRouter();
  const [deviceID, setDeviceID] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Searching....");
  const connectionStatusRef = useRef(connectionStatus);
  const deviceRef = useRef<Device | null>(null);
  const [nextPill, setNextPill] = useState(null); // To store the next pill details

  const context = useContext(PillDetailsContext);
  if (!context) {
    throw new Error("PillDetailsContext must be used within a PillDetailsProvider");
  }
  const { pillDetails, savePillDetails } = context;
  const [currentTime, setCurrentTime] = useState("");

  const TargetTime_from_user = pillDetails.map(({ pillName, time, slot, dosage }) => {
    const [hour, minute, second] = time.split(":").map(Number);
    return { pillName, time, slot, dosage, hour, minute, second };
  });

  const findNextPill = () => {
    const now = new Date();
    let nextPill = null;
    let closestTimeDiff = Infinity;

    TargetTime_from_user.forEach(({ pillName, time, slot, dosage, hour, minute, second }) => {
      const pillTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute,
        second
      );
      if (pillTime < now) pillTime.setDate(pillTime.getDate() + 1); // Handle next day's pills

      const timeDiff = pillTime - now;
      if (timeDiff > 0 && timeDiff < closestTimeDiff) {
        closestTimeDiff = timeDiff;
        nextPill = { pillName, time, slot, dosage };
      }
    });

    setNextPill(nextPill);
  };

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
      findNextPill(); // Update the next pill

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
    <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
    

    <View style={styles.nextPillContainer}>
        
        {nextPill ? (
          <View style={styles.nextPillBox}>
            <Text style={styles.nextPillTitle}>Coming up soon!</Text>
            <Text style={styles.nextPillText}>Pill Name: {nextPill.pillName}</Text>
            <Text style={styles.nextPillText}>Time: {nextPill.time}</Text>
            <Text style={styles.nextPillText}>Slot: {nextPill.slot}</Text>
            <Text style={styles.nextPillText}>Dosage: {nextPill.dosage}</Text>
            <Image 
          source={require('../assets/images/happy_face.png')} // Replace with your image path
          style={styles.image}
        />
          </View>
        ) : (
            <View style={styles.nextPillBox}>
          <Text style={styles.noNextPillText}>No pills scheduled
          </Text>
          <Image 
          source={require('../assets/images/Sad_face.png')} // Replace with your image path
          style={styles.image}
        />
          </View>
        )}
      </View>

  <View style={styles.header}>
        <Text style={styles.headerText}>List Of Pills</Text>
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

     <View style={styles.buttonContainer}>
      <Button
        title="Edit Pill Details"
        onPress={() => router.push("./enter_user_details")}
        color="#000"
      />
      </View>

      <View style={styles.currentTimeContainer}>
        <Text style={styles.currentTimeText}>Current Time:</Text>
        <Text style={styles.timeText}>{currentTime}</Text>
        <Text style={styles.connectionStatusText}>{connectionStatus}</Text>
        <Button title="Turn ON LED" onPress={() => sendData("1")} color="#000" />
        <Button title="Turn OFF LED" onPress={() => sendData("0")} color="#000" />
        <View style={styles.buttonRow}>
            <View style={styles.buttonContainer}>
                <Button title=" DISPENSE FROM SLOT 1" onPress={() => sendData("2")} color="#000" />
            </View>
            <View style={styles.buttonContainer}>
                <Button title=" DISPENSE FROM SLOT 2" onPress={() => sendData("3")} color="#000"/>
            </View>
        </View>
       
        <View style={styles.buttonRow}>
            <View style={styles.buttonContainer}>
             <Button title=" DISPENSE FROM SLOT 2" onPress={() => sendData("4")} color="#000"/>
            </View>
            <View style={styles.buttonContainer}>
             <Button title=" DISPENSE FROM SLOT 2" onPress={() => sendData("5")} color="#000"/>
            </View>
        </View>
        
      </View>
      
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#008080', // Change the background color of the page
      },
  image: {
        width: 30, // Adjust size as needed
        height: 30,
        resizeMode: 'contain',
      },
  // Add styles for the next pill and other elements here
  nextPillContainer: {
    marginTop: 20,
    width: "90%",
    alignItems: "center",
  },
  nextPillTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  
  nextPillBox: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#e3f2fd",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#90caf9",
    marginBottom: 30,
    marginTop: 90,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Offset for shadow
    shadowOpacity: 0.3, // Opacity of shadow
    shadowRadius: 5, // Blur radius of shadow

  },

  nextPillText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },

  noNextPillText: {
    fontSize: 16,
    color: "#999",
  },

  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  header: {
    padding: 5,
    backgroundColor: "#f4f4f4",
    width: "100%",
    borderBottomWidth: 1,
    borderColor:"#000000",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  pillHeader: {
    flexDirection: "row",
    padding: 10,
    width: "100%",
    backgroundColor: "#f4f4f4",
    borderBottomWidth: 1,
    borderColor:"#000000",
  },
  pillHeaderText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  pillDetailRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#0000000",
    backgroundColor: "#fafafa",
  },
  pillDetailText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#555",
  },
  currentTimeContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  currentTimeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  timeText: {
    fontSize: 18,
    marginVertical: 10,
    color: "#333",
  },
  connectionStatusText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#ccc",
  },
  buttonContainer: {
    color: '#000', // Text color
    marginTop: 20,
    marginRight: 10,
    width: "30%",
    justifyContent: "space-between",
    backgroundColor: "#F0F0F0",
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Offset for shadow
    shadowOpacity: 0.3, // Opacity of shadow
    shadowRadius: 5, // Blur radius of shadow
  },
  buttonText: {
    color: '#000', // Text color
    fontSize: 10,
  },
  buttonRow: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Space between buttons
    flexWrap: 'wrap', // Allow buttons to wrap if the screen is too narrow
  },
});




///////////////////////////////

// import { BleManager, Device } from "react-native-ble-plx";
// import { useState, useEffect, useRef } from "react";
// import React from "react";
// import { View, Button, Text, Alert } from "react-native";
// import { atob, btoa } from "react-native-quick-base64";
// import { useLocalSearchParams } from 'expo-router';


// const bleManager = new BleManager();
// const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
// const CHARACTERISTIC_UUID = "12345678-1234-5678-1234-56789abcdef1";

// export default function back_end() {
//   const [deviceID, setDeviceID] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState("Searching....");
//   // const deviceRef = useRef(null);
//   const connectionStatusRef = useRef(connectionStatus);
//   const deviceRef = useRef<Device | null>(null); // Correctly typing the ref
  
//   const { pillTimeSlotDosageData } = useLocalSearchParams(); // Access query parameter passedData

//   const TargetTime_from_user = (Array.isArray(pillTimeSlotDosageData) 
//     ? pillTimeSlotDosageData[0] // If it's an array, take the first element
//     : pillTimeSlotDosageData // Otherwise, use it directly
//     )?.split(',').map((item) => {
//     const [time, slot, dosage] = item.split(';');
//     return [time, slot, dosage]; //-------------for user entered detail parsing
//     //return {time, slot, dosage};
//     }) || [];

//   const [currentTime, setCurrentTime] = useState("");
//   const targetTime1 = { hour: 17, minute: 16, second: 40 }; // Example: 14:30:00 (2:30 PM)
//   const targetTime2 = { hour: 10, minute: 19, second: 40 }; // Example: 14:30:00 (2:30 PM)
//   const targetTime3 = { hour: 21, minute: 58, second: 0 }; // Example: 14:30:00 (2:30 PM)
//   const targetTime4 = { hour: 21, minute: 58, second: 0 }; // Example: 14:30:00 (2:30 PM)

//   const searchAndConnectToDevice = () => {
//     bleManager.startDeviceScan(null, null, (error, device) => {
//       if (error) {
//         console.error(error);
//         setConnectionStatus("Error searching for devices");
//         return;
//       }
  
//       // Log each device discovered
  
//       if (device.name === "ESP32") {
//         bleManager.stopDeviceScan();
//         setConnectionStatus("Connecting...");
//         connectionStatusRef.current = "Connected";
//         connectToDevice(device);
//       }
//     });
//   };
  

   
//   const connectToDevice = async (device) => {
//     try {
//       await device.connect();  // Wait for the connection to complete
//       setDeviceID(device.id);
//       setConnectionStatus("Connected");
//       deviceRef.current = device;
  
//       // Discover services and characteristics after the connection is established
//       await device.discoverAllServicesAndCharacteristics();
//       return connectionStatus;
//     } catch (error) {
//       console.log(error);
//       setConnectionStatus("Error in Connection");
//       searchAndConnectToDevice();
//     }
//   };
  
//   const sendData = async (data,repetitions=1) => {
    
//     if (!deviceRef.current) {
//       console.log("Device is not available for sending data.");
//       return;
//     }

//     if (connectionStatusRef.current !== "Connected") {
      
//       console.log("Attempting to reconnect...");
//       await connectToDevice(deviceRef.current);
//       if (connectionStatusRef.current !== "Connected") {
//         console.log("Unable to reconnect to the device.");
//         return;
//       }
//     }

//     try {
//         for (let i = 0; i < repetitions; i++) {
//             const encodedData = btoa(data); // Convert string to Base64
//             console.log(`Sending data (${i + 1}/${repetitions}):`, data);
      
//             await deviceRef.current.writeCharacteristicWithResponseForService(
//               SERVICE_UUID,
//               CHARACTERISTIC_UUID,
//               encodedData
//             );
//             console.log(`Data sent to ESP32 (${i + 1}/${repetitions})`);
      
//             // Optional: Add a small delay between sends
//             if (i < repetitions - 1) {
//               await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay
//             }
//           }
//         } catch (error) {
//           console.error("Error sending data:", error);
//         }
//       };

//   useEffect(() => { 
//     searchAndConnectToDevice();
//     //Update the time every second
//     const interval = setInterval(() => {
//       const now = new Date();
//       const formattedTime = now.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//       });
//       setCurrentTime(formattedTime);
//       console.log(connectionStatusRef.current); 
// //************************************************************************************************************************** */
//       // Iterate through the target time array that user has input
//         TargetTime_from_user.forEach(([time, slot, dosage]) => {
//             // Split time into hours, minutes, and seconds
           
//             const [hour, minute, second] = time.split(":").map(Number);
            
//             // Check if the current time matches the target time
//             if (
//             now.getHours() === hour &&
//             now.getMinutes() === minute &&
//             now.getSeconds() === second
//             ) {
//             console.log(`The time is now ${formattedTime}. Sending data to ESP32 for slot ${slot}.`);

//             // Send data corresponding to the slot
//             sendData(slot, parseInt(dosage, 10)); // sending the data to turn motors based on dosage quantity
//             }
//         });
// //************************************************************************************************************************** */

//     //  Check if the current time matches the target time (hour, minute, and second)
//     //   if (
//     //     //FIRST MOTOR--2
//     //     now.getHours() === targetTime1.hour &&
//     //     now.getMinutes() === targetTime1.minute &&
//     //     now.getSeconds() === targetTime1.second
//     //   ) {
//     //     console.log(`The time is now ${formattedTime}. Sending data to ESP32.`);
       
//     //     sendData("2",2); // Replace with the data you want to send
//     //   }
//     //   if (
//     //     //SECOND MOTOR--3
//     //     now.getHours() === targetTime2.hour &&
//     //     now.getMinutes() === targetTime2.minute &&
//     //     now.getSeconds() === targetTime2.second
//     //   ) {
//     //     console.log(`The time is now ${formattedTime}. Sending data to ESP32.`);
       
//     //     sendData("3"); // Replace with the data you want to send
//     //   }
//     //   if (
//     //     //THIRD MOTOR--4
//     //     now.getHours() === targetTime3.hour &&
//     //     now.getMinutes() === targetTime3.minute &&
//     //     now.getSeconds() === targetTime3.second
//     //   ) {
//     //     console.log(`The time is now ${formattedTime}. Sending data to ESP32.`);
       
//     //     sendData("4"); // Replace with the data you want to send
//     //   }
//     //   if (
//     //     //FOURTH MOTOR--5
//     //     now.getHours() === targetTime4.hour &&
//     //     now.getMinutes() === targetTime4.minute &&
//     //     now.getSeconds() === targetTime4.second
//     //   ) {
//     //     console.log(`The time is now ${formattedTime}. Sending data to ESP32.`);
       
//     //     sendData("5"); // Replace with the data you want to send
//     //   }
//       //will this work for multiple of the same time????????????? yesss
//      }, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//    }, []);


//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//         {/* display the time, dosage and motor that is meant to turn */}
//      {/* <View>
//         <Text>Pill Times and Slots:</Text>
//       {TargetTime_from_user.map((pill, index) => (
//         <Text key={index}>{pill[0]} - Slot: {pill[1]} - Dosage: {pill[2]}</Text>
//       ))}
//     </View> */}
  
//       <Text style={{ fontSize: 24, fontWeight: "bold" }}>Current Time:</Text>
//       <Text style={{ fontSize: 20, marginBottom: 20 }}>{currentTime}</Text>
//       <Text> {connectionStatus}</Text>
//       <Button title="Turn ON LED" onPress={() => sendData("1")} />
//       <Button title=" TIME" onPress={() => sendData("2")} />
//       <Button title="Turn OFF LED" onPress={() => sendData("0")} />
//     </View>
//   );
// }

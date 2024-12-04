
// import { useBluetooth } from "./BLEContext";
// import React, { useState, useEffect, useRef, useContext } from "react";
// import { Alert, View, Button, Text, ScrollView, StyleSheet, Image } from "react-native";
// import PillDetailsContext from "./PillDetailsContext";
// import { useRouter } from "expo-router";
// import { atob, btoa } from "react-native-quick-base64";


// const BackEnd = ( ) => {
//   const { connectionStatus, sendData } = useBluetooth();
//   const [currentTime, setCurrentTime] = useState("");
//   const router = useRouter();
//   const [nextPill, setNextPill] = useState(null); // To store the next pill details

//   const context = useContext(PillDetailsContext);
//   if (!context) {
//     throw new Error("PillDetailsContext must be used within a PillDetailsProvider");
//   }
//   const { pillDetails, savePillDetails } = context;


//   const TargetTime_from_user = pillDetails.map(({ pillName, time, slot, dosage }) => {
//     const [hour, minute, second] = time.split(":").map(Number);
//     return { pillName, time, slot, dosage, hour, minute, second };
//   });

//   const findNextPill = () => {
//     const now = new Date();
//     let nextPill = null;
//     let closestTimeDiff = Infinity;

//     TargetTime_from_user.forEach(({ pillName, time, slot, dosage, hour, minute, second }) => {
//       const pillTime = new Date(
//         now.getFullYear(),
//         now.getMonth(),
//         now.getDate(),
//         hour,
//         minute,
//         second
//       );
//       if (pillTime < now) pillTime.setDate(pillTime.getDate() + 1); // Handle next day's pills

//       const timeDiff = pillTime - now;
//       if (timeDiff > 0 && timeDiff < closestTimeDiff) {
//         closestTimeDiff = timeDiff;
//         nextPill = { pillName, time, slot, dosage };
//       }
//     });

//     setNextPill(nextPill);
//   };

//   // Alert user if connection is not set up
//   const checkConnection = () => {
  
//     if (connectionStatus !== "Connected") {
//       Alert.alert(
//         "Connection Error",
//         "Bluetooth device is not connected. Please ensure that your device is connected.",
//         [{ text: "OK" }]
//       );
//     }
//   };

//   useEffect(() => {
//     checkConnection();

//     const interval = setInterval(() => {
//               const now = new Date();
//               const formattedTime = now.toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 second: "2-digit",
//               });
//               setCurrentTime(formattedTime);
//               findNextPill(); // Update the next pill
        
//               TargetTime_from_user.forEach(({ pillName, time, slot, dosage, hour, minute, second }) => {
//                 if (now.getHours() === hour && now.getMinutes() === minute && now.getSeconds() === second) {
//                   console.log(`The time is now ${formattedTime}. Sending data to ESP32 for slot ${slot}.`);
//                   sendData(""+(parseInt(slot,10)+1), parseInt(dosage, 10)); // Sending data based on dosage
//                 }
//               });
//             }, 1000);
        
//           return () => clearInterval(interval); // Clear interval on unmount
//         }, []); // Run only once on component mount

//   return (
//     <View style={styles.container}>
//          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
//          <View style={styles.nextPillContainer}>
            
//             {nextPill ? (
//               <View style={styles.nextPillBox}>
//                 <Text style={styles.nextPillTitle}>Coming up soon!</Text>
//                 <Text style={styles.nextPillText}>Pill Name: {nextPill.pillName}</Text>
//                 <Text style={styles.nextPillText}>Time: {nextPill.time}</Text>
//                 <Text style={styles.nextPillText}>Slot: {nextPill.slot}</Text>
//                 <Text style={styles.nextPillText}>Dosage: {nextPill.dosage}</Text>
//                 <Image 
//               source={require('../assets/images/happy_face.png')} // Replace with your image path
//               style={styles.image}
//             />
//               </View>
//             ) : (
//                 <View style={styles.nextPillBox}>
//               <Text style={styles.noNextPillText}>No pills scheduled
//               </Text>
//               <Image 
//               source={require('../assets/images/Sad_face.png')} // Replace with your image path
//               style={styles.image}
//             />
//               </View>
//             )}
//           </View>
    
//       <View style={styles.header}>
//             <Text style={styles.headerText}>List Of Pills</Text>
//           </View>

//           {pillDetails.length === 0 ? (
//   <View style={styles.noPillsContainer}>
//     <Text style={styles.noPillsText}>No pills to list</Text>
//   </View>
// ) : (
//   <>
//           <View style={styles.pillHeader}>
//             <Text style={styles.pillHeaderText}>Pill Name</Text>
//             <Text style={styles.pillHeaderText}>Time</Text>
//             <Text style={styles.pillHeaderText}>Slot</Text>
//             <Text style={styles.pillHeaderText}>Dosage</Text>
//           </View>
    
//           {pillDetails.map(({ pillName, time, slot, dosage }, index) => (
//             <View key={index} style={styles.pillDetailRow}>
//               <Text style={styles.pillDetailText}>{pillName}</Text>
//               <Text style={styles.pillDetailText}>{time}</Text>
//               <Text style={styles.pillDetailText}>{slot}</Text>
//               <Text style={styles.pillDetailText}>{dosage}</Text>
//             </View>
//             ))}
//   </>
//          )}


//          <View style={styles.buttonContainer}>
//           <Button
//             title="Edit Pill Details"
//             onPress={() => router.push("./enter_user_details")}
//             color="#000"
//           />
//           </View>
    
//           <View style={styles.currentTimeContainer}>
//             <Text style={styles.currentTimeText}>Current Time:</Text>
//             <Text style={styles.timeText}>{currentTime}</Text>
//             <Text style={styles.connectionStatusText}>{connectionStatus}</Text>
//             <Button title="Turn ON LED" onPress={() => sendData("1")} color="#000" />
//             <Button title="Turn OFF LED" onPress={() => sendData("0")} color="#000" />
//             <View style={styles.buttonRow}>
//                 <View style={styles.buttonContainer}>
//                     <Button title=" DISPENSE FROM SLOT 1" onPress={() => sendData("2")} color="#000" />
//                 </View>
//                 <View style={styles.buttonContainer}>
//                     <Button title=" DISPENSE FROM SLOT 2" onPress={() => sendData("3")} color="#000"/>
//                 </View>
//             </View>
           
//             <View style={styles.buttonRow}>
//                 <View style={styles.buttonContainer}>
//                  <Button title=" DISPENSE FROM SLOT 3" onPress={() => sendData("4")} color="#000"/>
//                 </View>
//                 <View style={styles.buttonContainer}>
//                  <Button title=" DISPENSE FROM SLOT 4" onPress={() => sendData("5")} color="#000"/>
//                 </View>
//             </View> 
            
//            </View>
          
//         </ScrollView>
//         </View>
//       );
//     }
    
//     const styles = StyleSheet.create({
    
//         container: {
//             flex: 1,
//             justifyContent: 'center',
//             backgroundColor: '#008080', // Change the background color of the page
//           },
//       image: {
//             width: 30, // Adjust size as needed
//             height: 30,
//             resizeMode: 'contain',
//           },
//       // Add styles for the next pill and other elements here
//       nextPillContainer: {
//         marginTop: 20,
//         width: "90%",
//         alignItems: "center",
//       },
//       nextPillTitle: {
//         fontSize: 20,
//         fontWeight: "bold",
//         color: "#333",
//         marginBottom: 10,
//       },
      
//       nextPillBox: {
//         width: "100%",
//         padding: 10,
//         alignItems: "center",
//         alignSelf: "center",
//         backgroundColor: "#e3f2fd",
//         borderRadius: 5,
//         borderWidth: 1,
//         borderColor: "#90caf9",
//         marginBottom: 30,
//         marginTop: 90,
//         shadowColor: '#000', // Shadow color
//         shadowOffset: { width: 0, height: 4 }, // Offset for shadow
//         shadowOpacity: 0.3, // Opacity of shadow
//         shadowRadius: 5, // Blur radius of shadow
    
//       },
    
//       nextPillText: {
//         fontSize: 16,
//         color: "#333",
//         marginBottom: 5,
//       },
    
//       noNextPillText: {
//         fontSize: 16,
//         color: "#999",
//       },
    
//       scrollViewContainer: {
//         flexGrow: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingBottom: 20,
//       },
//       header: {
//         padding: 5,
//         backgroundColor: "#f4f4f4",
//         width: "100%",
//         borderBottomWidth: 1,
//         borderColor:"#000000",
//       },
//       headerText: {
//         fontSize: 24,
//         fontWeight: "bold",
//         textAlign: "center",
//         color: "#333",
//       },
//       pillHeader: {
//         flexDirection: "row",
//         padding: 10,
//         width: "100%",
//         backgroundColor: "#f4f4f4",
//         borderBottomWidth: 1,
//         borderColor:"#000000",
//       },
//       pillHeaderText: {
//         flex: 1,
//         textAlign: "center",
//         fontWeight: "bold",
//         fontSize: 16,
//         color: "#333",
//       },
//       pillDetailRow: {
//         flexDirection: "row",
//         padding: 10,
//         borderBottomWidth: 1,
//         borderColor: "#0000000",
//         backgroundColor: "#fafafa",
//       },
//       pillDetailText: {
//         flex: 1,
//         textAlign: "center",
//         fontSize: 16,
//         color: "#555",
//       },
//       currentTimeContainer: {
//         marginTop: 20,
//         alignItems: "center",
//       },
//       currentTimeText: {
//         fontSize: 20,
//         fontWeight: "bold",
//         color: "#333",
//       },
//       timeText: {
//         fontSize: 18,
//         marginVertical: 10,
//         color: "#333",
//       },
//       connectionStatusText: {
//         fontSize: 16,
//         marginVertical: 5,
//         color: "#ccc",
//       },
//       buttonContainer: {
//         color: '#000', // Text color
//         marginTop: 20,
//         marginRight: 10,
//         width: "30%",
//         justifyContent: "space-between",
//         backgroundColor: "#F0F0F0",
//         shadowColor: '#000', // Shadow color
//         shadowOffset: { width: 0, height: 4 }, // Offset for shadow
//         shadowOpacity: 0.3, // Opacity of shadow
//         shadowRadius: 5, // Blur radius of shadow
//       },
//       buttonText: {
//         color: '#000', // Text color
//         fontSize: 10,
//       },
//       buttonRow: {
//         flexDirection: 'row', // Arrange buttons in a row
//         justifyContent: 'space-between', // Space between buttons
//         flexWrap: 'wrap', // Allow buttons to wrap if the screen is too narrow
//       },

//       noPillsContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 20,
//       },
//       noPillsText: {
//         fontSize: 16,
//         color: 'white',
//       },
//     });
    

// export default BackEnd;



import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBluetooth } from "./BLEContext";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Alert, View, Button, Text, ScrollView, StyleSheet, Image } from "react-native";
import PillDetailsContext from "./PillDetailsContext";
import { useRouter } from "expo-router";

const BackEnd = () => {
  const { connectionStatus, sendData } = useBluetooth();
  const [currentTime, setCurrentTime] = useState("");
  const router = useRouter();
  const [nextPill, setNextPill] = useState(null); // To store the next pill details
  const [pillDetails, setPillDetails] = useState([]); // To store pill details from AsyncStorage
  const [lastTriggeredSlot, setLastTriggeredSlot] = useState(null);

  const loadPillDetails = async () => {
    try {
      const storedPills = await AsyncStorage.getItem("pillDetails");
      if (storedPills) {
        setPillDetails(JSON.parse(storedPills));
      }
    } catch (error) {
      console.error("Failed to load pill details:", error);
    }
  };

  useEffect(() => {
    loadPillDetails();
  }, []);

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

  useEffect(() => {
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
        if (now.getHours() === hour && now.getMinutes() === minute && now.getSeconds() === second &&
        lastTriggeredSlot !== slot){ // Check if this slot hasn't already been triggered) {
          console.log(`The time is now ${formattedTime}. Sending data to ESP32 for slot ${slot}.`);
          sendData("" + (parseInt(slot, 10) + 1), parseInt(dosage, 10)); // Sending data based on dosage
          setLastTriggeredSlot(slot); // Update the last triggered slot
        }
      });
    }, 1000);

    return () => clearInterval(interval); // Clear interval on unmount
  }, [TargetTime_from_user, lastTriggeredSlot]);

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
              <Text style={styles.noNextPillText}>No pills scheduled</Text>
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

        {pillDetails.length === 0 ? (
          <View style={styles.noPillsContainer}>
            <Text style={styles.noPillsText}>No pills to list</Text>
          </View>
        ) : (
          <>
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
          </>
        )}

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
               <Button title=" DISPENSE FROM SLOT 2" onPress={() => sendData("3")} color="#000" />
             </View>
           </View>

           <View style={styles.buttonRow}>
             <View style={styles.buttonContainer}>
               <Button title=" DISPENSE FROM SLOT 3" onPress={() => sendData("4")} color="#000" />
             </View>
             <View style={styles.buttonContainer}>
               <Button title=" DISPENSE FROM SLOT 4" onPress={() => sendData("5")} color="#000" />
             </View>
           </View>
         </View>
      </ScrollView>
    </View>
  );
};

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
        marginTop: 7,
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

      noPillsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
      },
      noPillsText: {
        fontSize: 16,
        color: 'white',
      },

});


export default BackEnd;
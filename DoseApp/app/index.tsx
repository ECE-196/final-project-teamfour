// import React from "react";
// import { View, Text, Button, ImageBackground, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
// import { PillDetailsProvider } from "./PillDetailsContext"; // Import your context provider

// export default function App() {
//   const router = useRouter();

//   return (
//     // Wrap the app content with PillDetailsProvider
//     <PillDetailsProvider>
//       <ImageBackground
//         source={require("/Users/anupamanambiar/Desktop/DoseApp_2/assets/images/pill_bg.png")} // Path to your image
//         style={styles.background}
//         resizeMode="cover" // Adjust the resize mode (cover, contain, stretch)
//       >
//         <View style={styles.content}>
//           <View style={styles.textBox}>
//             <Text style={styles.text}>..DoseApp..</Text>

//              <Button
//               title="Go to Back End page"
//               onPress={() => router.push("./major_backEnd")} // Navigate to /major_backEnd
//             />
//             <Button
//               title="login"
//               onPress={() => router.push("./login")} // Navigate to login
//             />
//             <Button
//               title="Go to user_details"
//               onPress={() => router.push("./enter_user_details")} // Navigate to /enter_user_details
//             />
//           </View>
//         </View>
//       </ImageBackground>
//     </PillDetailsProvider>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   textBox: {
//     backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent black
//     padding: 15,
//     borderRadius: 10, // Rounded corners
//     marginBottom: 20, // Space below the box
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#fff",
//   },
// });


//initializing in 2 secinds

import React, { useEffect } from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { PillDetailsProvider } from "./PillDetailsContext"; // Import your context provider
import BackgroundFetch from 'react-native-background-fetch';

export default function App() {
  const router = useRouter();

  useEffect(() => {

    const initializeBackgroundFetch = async () => {
            try {
              // Initialize background fetch
              const status = await BackgroundFetch.configure(
                {
                  minimumFetchInterval: 15, // Fetch every 15 minutes
                  stopOnTerminate: false,    // Continue fetching even after app is terminated
                  startOnBoot: true,         // Start fetching on boot
                },
                async (taskId) => {
                  console.log('[BackgroundFetch] taskId: ', taskId);
                  // Your task logic here
                  BackgroundFetch.finish(taskId);
                },
                (error) => {
                  console.log('[BackgroundFetch] failed to start', error);
                }
              );
              console.log('[BackgroundFetch] configured with status: ', status);
            } catch (error) {
              console.log('Error initializing BackgroundFetch', error);
            }
          };

          initializeBackgroundFetch();

       



    // Navigate to the desired page after 2 seconds
    const timer = setTimeout(() => {
      router.push("./login"); // Change this to the screen you want to navigate to
    }, 2000);
 return () => {
          // Clean up background fetch when component unmounts
          BackgroundFetch.stop();
          clearTimeout(timer);
        };
   
  }, []);
 

  return (
    // Wrap the app content with PillDetailsProvider
    <PillDetailsProvider>
      <ImageBackground
        source={require("/Users/anupamanambiar/Desktop/DoseApp_2/assets/images/pill_bg.png")} // Path to your image
        style={styles.background}
        resizeMode="cover" // Adjust the resize mode (cover, contain, stretch)
      >
        <View style={styles.content}>
          <View style={styles.textBox}>
            <Text style={styles.text}>..DoseBuddy..</Text>
          </View>
        </View>
      </ImageBackground>
    </PillDetailsProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textBox: {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent black
    padding: 15,
    borderRadius: 10, // Rounded corners
    marginBottom: 20, // Space below the box
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
});


// import React, { useEffect, useContext } from 'react';
// import { View, Text } from 'react-native';
// import BackgroundFetch from 'react-native-background-fetch';

// export default function App() {
//   useEffect(() => {
//     // Make sure BackgroundFetch is properly initialized
//     const initializeBackgroundFetch = async () => {
//       try {
//         // Initialize background fetch
//         const status = await BackgroundFetch.configure(
//           {
//             minimumFetchInterval: 15, // Fetch every 15 minutes
//             stopOnTerminate: false,    // Continue fetching even after app is terminated
//             startOnBoot: true,         // Start fetching on boot
//           },
//           async (taskId) => {
//             console.log('[BackgroundFetch] taskId: ', taskId);
//             // Your task logic here
//             BackgroundFetch.finish(taskId);
//           },
//           (error) => {
//             console.log('[BackgroundFetch] failed to start', error);
//           }
//         );
//         console.log('[BackgroundFetch] configured with status: ', status);
//       } catch (error) {
//         console.log('Error initializing BackgroundFetch', error);
//       }
//     };

//     initializeBackgroundFetch();

//     return () => {
//       // Clean up background fetch when component unmounts
//       BackgroundFetch.stop();
//     };
//   }, []);

//   return (
//     <View>
//       <Text>App is running with Background Fetch!</Text>
//     </View>
//   );
// }

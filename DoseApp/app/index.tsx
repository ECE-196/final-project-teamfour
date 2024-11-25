import React from "react";
import { View, Text, Button, ImageBackground, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomePage() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("/Users/anupamanambiar/Desktop/DoseApp_2/assets/images/pill_bg.png")} // Path to your image
      style={styles.background}
      resizeMode="cover" // Adjust the resize mode (cover, contain, stretch)
    >
      <View style={styles.content}>
      <View style={styles.textBox}>
          <Text style={styles.text}>..DoseApp..</Text>
      
        <Button
          title="Go to Back End page"
          onPress={() => router.push("./major_backEnd")} // Navigate to /major_backEnd
        />
        <Button
          title="Go to user_details"
          onPress={() => router.push("./enter_user_details")} // Navigate to /major_backEnd
        />
      </View>
      </View>
    </ImageBackground>
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

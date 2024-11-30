import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PillDetailsContext from "./PillDetailsContext"; // Adjust the import according to your folder structure
import { useRouter } from "expo-router";

export default function PillDetailsScreen() {
  const router = useRouter();

  type PillDetail = {
    id: string;
    pillName: string;
    dosage: string;
    time: string;
    slot: string; // Make sure slot is added here as it's used in the state
  };

  const [pillName, setPillName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [slot, setSlot] = useState("");
  const { pillDetails, setPillDetails } = useContext(PillDetailsContext); // Use context to manage pillDetails state

  const [isTableVisible, setIsTableVisible] = useState(false); // Track if the table is visible
  const height = useRef(new Animated.Value(0)).current; // For animation, using useRef here

  // Save data to AsyncStorage
  const saveData = async (data: PillDetail[]) => {
    try {
      await AsyncStorage.setItem("pillDetails", JSON.stringify(data));
    } catch (e) {
      console.log("Failed to save data:", e);
    }
  };

  // Load data from AsyncStorage when the component mounts
  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem("pillDetails");
      if (storedData) {
        setPillDetails(JSON.parse(storedData));
      }
    } catch (e) {
      console.log("Failed to load data:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add Pill Detail with Validation
  const addPillDetail = () => {
    const pillNameRegex = /^[a-zA-Z0-9\s]+$/;
    if (!pillNameRegex.test(pillName)) {
      Alert.alert(
        "Invalid Pill Name",
        "Please use only letters, numbers, and spaces."
      );
      return;
    }

    const dosageRegex = /^\d+(\.\d+)?$/;
    if (!dosageRegex.test(dosage) || parseFloat(dosage) <= 0) {
      Alert.alert(
        "Invalid Dosage",
        "Please enter a valid positive number for dosage."
      );
      return;
    }

    const slotRegex = /^\d+(\.\d+)?$/;
    const slotValue = parseFloat(slot);
    if (!slotRegex.test(slot) || slotValue < 0 || slotValue > 4) {
      Alert.alert(
        "Invalid Slot Number",
        "Please enter a Slot number between 0 and 4 (inclusive)."
      );
      return;
    }

    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      Alert.alert(
        "Invalid Time",
        "Please use the format HH:MM:SS (e.g., 8:00:00)."
      );
      return;
    }

    // If validation passes, add the new pill details
    const newDetails = [
      ...pillDetails,
      { id: Date.now().toString(), pillName, dosage, slot, time },
    ];
    setPillDetails(newDetails); // Update the context state
    saveData(newDetails); // Persist the data to AsyncStorage
    setPillName(""); // Clear form fields
    setDosage("");
    setSlot("");
    setTime("");
  };

  const renderItem = ({ item }: { item: PillDetail }) => (
    <TouchableOpacity
      onLongPress={() =>
        Alert.alert(
          "Remove Pill",
          "Are you sure you want to delete this entry?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                const updatedDetails = pillDetails.filter(
                  (detail) => detail.id !== item.id
                );
                setPillDetails(updatedDetails); // Update the context state
                saveData(updatedDetails); // Persist the data to AsyncStorage
              },
            },
          ]
        )
      }
    >
      <View style={styles.row}>
        <Text style={styles.cell}>{item.pillName}</Text>
        <Text style={styles.cell}>{item.dosage}</Text>
        <Text style={styles.cell}>{item.slot}</Text>
        <Text style={styles.cell}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  // Toggle the visibility of the table with animation
  const toggleTableVisibility = () => {
    const toValue = isTableVisible ? 0 : 200; // Toggle height value (collapsed = 0, expanded = 200)

    Animated.timing(height, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsTableVisible(!isTableVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Pill Details</Text>

      {/* Form Fields */}
      <TextInput
        style={styles.input}
        placeholder="Pill Name"
        placeholderTextColor="#999"
        value={pillName}
        onChangeText={setPillName}
      />
      <TextInput
        style={styles.input}
        placeholder="Dosage (number of pills)"
        placeholderTextColor="#999"
        value={dosage}
        keyboardType="numeric"
        onChangeText={setDosage}
      />
      <TextInput
        style={styles.input}
        placeholder="Slot"
        placeholderTextColor="#999"
        value={slot}
        keyboardType="numeric"
        onChangeText={setSlot}
      />
      <TextInput
        style={styles.input}
        placeholder="Time (e.g. 8:00:00)"
        placeholderTextColor="#999"
        value={time}
        onChangeText={setTime}
      />

      <View style={styles.buttonContainer}>
        <Button title="Add Pill to Table" onPress={addPillDetail} />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Return to home screen"
          onPress={() => router.push("./major_backEnd")} // Navigate to /enter_user_details
        />
      </View>

      <View style={styles.buttonContainer}>
        {/* Toggle Table Visibility Button */}
        <Button
          title={isTableVisible ? "Collapse" : "Tap to see current Pill Details"}
          onPress={toggleTableVisibility}
        />
      </View>

      {/* Table Content */}
      <Animated.View style={[styles.table, { height }]}>
        {pillDetails.length > 0 && (
          <>
            <Text style={styles.tableHeader}>Current Pill Schedule</Text>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeaderCell}>Pill Name</Text>
              <Text style={styles.tableHeaderCell}>Dosage</Text>
              <Text style={styles.tableHeaderCell}>Slot</Text>
              <Text style={styles.tableHeaderCell}>Time</Text>
            </View>
          </>
        )}

        {/* Table Rows */}
        <FlatList
          data={pillDetails}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.table}
        />
      </Animated.View>
    </View>
  );
}


const styles = StyleSheet.create({
    
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#008080",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FFFF"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  table: {
    marginTop: 5,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    padding:5,
    borderWidth: 1,
    borderColor: "#FFFF",
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
    
  },
  row: {
    flexDirection: "row",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    

  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  buttonContainer: {
    color: '#F5D1A1', // Text color
    marginTop: 20,
    marginRight: 10,
    width: "50%",
    justifyContent: "space-between",
    backgroundColor: "#F0F0F0",
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Offset for shadow
    shadowOpacity: 0.3, // Opacity of shadow
    shadowRadius: 5, // Blur radius of shadow
    alignSelf:"center"
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

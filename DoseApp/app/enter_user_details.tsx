    
      import React, { useState, useEffect } from "react";
      import {
        View,
        Text,
        TextInput,
        Button,
        StyleSheet,
        FlatList,
        TouchableOpacity,
        Alert,
      } from "react-native";
      import AsyncStorage from "@react-native-async-storage/async-storage";
      import { useRouter } from 'expo-router';

      export default function PillDetailsScreen() {
        type PillDetail = {
            id: string;
            pillName: string;
            dosage: string;
            time: string;
          };

          const [pillName, setPillName] = useState("");
          const [dosage, setDosage] = useState("");
          const [time, setTime] = useState("");
          const [slot, setSlot] = useState("");
          const [pillDetails, setPillDetails] = useState([]);

          const [data, setData] = useState('');
          const router = useRouter(); // Router hook

          const handlePress = () => {
            // Pass data as part of the URL
            const pillTimeSlotDosageData = pillDetails.map((pill) => `${pill.time};${pill.slot};${pill.dosage}`).join(',');
            console.log(pillTimeSlotDosageData);
            // Send this string as part of the URL
            router.push(`./major_backEnd?pillTimeSlotDosageData=${pillTimeSlotDosageData}`);
            };


          // Save data to AsyncStorage
          const saveData = async (data) => {
            try {
              await AsyncStorage.setItem("pillDetails", JSON.stringify(data));
            } catch (e) {
              console.log("Failed to save data:", e);
            }
          };
        
          // Load data from AsyncStorage on app load
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
            // Pill Name Validation: Allow alphanumeric and spaces
            const pillNameRegex = /^[a-zA-Z0-9\s]+$/;
            if (!pillNameRegex.test(pillName)) {
              Alert.alert(
                "Invalid Pill Name",
                "Please use only letters, numbers, and spaces."
              );
              return;
            }
        
            // Dosage Validation: Positive number (integer or decimal)
            const dosageRegex = /^\d+(\.\d+)?$/;
            if (!dosageRegex.test(dosage) || parseFloat(dosage) <= 0) {
              Alert.alert(
                "Invalid Dosage",
                "Please enter a valid positive number for dosage."
              );
              return;
            }

            const slotRegex = /^\d+(\.\d+)?$/;
            const slotValue = parseFloat(slot); // Convert string to a number
            if (!slotRegex.test(slot) || slotValue < 0 || slotValue > 4) {
                 Alert.alert(
                     "Invalid Slot Number",
                    "Please enter a Slot number between 0 and 4 (inclusive)."
             );
    return;
  }
        
            // Time Validation: Format HH:MM AM/PM
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
            if (!timeRegex.test(time)) {
              Alert.alert(
                "Invalid Time",
                "Please use the format HH:MM:SS(e.g., 8:00:00)."
              );
              return;
            }
        
            // If all validations pass, add the pill detail
            const newDetails = [
              ...pillDetails,
              { id: Date.now().toString(), pillName, dosage, slot, time },
            ];
            setPillDetails(newDetails);
            saveData(newDetails); // Save updated details
            setPillName("");
            setDosage("");
            setSlot("");
            setTime("");
          };
        
          const renderItem = ({ item }) => (
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
                        setPillDetails(updatedDetails);
                        saveData(updatedDetails);
                      },
                    },
                  ]
                )
              }
            >
              <View style={styles.row}>
                <Text style={styles.cell}>{item.pillName}</Text>
                <Text style={styles.cell}>{item.dosage} </Text>
                <Text style={styles.cell}>{item.slot} </Text>
                <Text style={styles.cell}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          );
        
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
                placeholder="Time (e.g.8:00:00)"
                placeholderTextColor="#999"
                value={time}
                onChangeText={setTime}
              />

            
            <Button title="Go to Screen 2" onPress={handlePress} />
              
                    
              <Button title="Add Pill" onPress={addPillDetail} />
        
              {/* Table Header */}
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
        
              {/* Table Content */}
              <FlatList
                data={pillDetails}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.table}
              />
            </View>
          );
        }
        
        const styles = StyleSheet.create({
          container: {
            flex: 1,
            padding: 20,
            backgroundColor: "#f5f5f5",
          },
          header: {
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
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
            marginTop: 20,
          },
          tableHeader: {
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 20,
            marginBottom: 10,
            textAlign: "center",
          },
          tableRow: {
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
            paddingVertical: 5,
          },
          row: {
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
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
        });
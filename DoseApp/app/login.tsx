import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";




const LoginScreen = () => {
  // State variables for user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail) {
        // If email is found in local storage, consider the user logged in
        Alert.alert('Welcome back', 'You are already logged in!');
        useRouter().push("./major_backEnd")
        // Navigate to next screen, for example:
        // navigation.navigate('Home');
      }
    };
    checkLoginStatus();
  }, []);

  // Validation function
  const validateInputs = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return false;
    }
    return true;
  };

  // Handle login form submission
  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      // Example of mock authentication logic
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('password');

      if (email === storedEmail && password === storedPassword) {
        // Successful login
        Alert.alert('Success', 'Login successful!');
        // Save login status (optional, for future checks)
        await AsyncStorage.setItem('isLoggedIn', 'true');
        // Navigate to next screen, e.g., Home
        useRouter().push("./major_backEnd")
      } else {
        Alert.alert('Error', 'Invalid email or password.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration logic (for creating a new user)
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    // Store credentials locally for mock registration
    try {
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('password', password);
      Alert.alert('Success', 'User registered successfully!');
    } catch (error) {
      Alert.alert('Error', 'Registration failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={isLoading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={isLoading}
      />
      <Button
        title="Register"
        onPress={handleRegister}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});

export default LoginScreen;

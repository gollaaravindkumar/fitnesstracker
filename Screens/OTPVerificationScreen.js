import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const OTPVerificationScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert('Error', 'OTP is required!');
      return;
    }

    try {
      const response = await axios.post('https://ngage.nexalink.co/health/loginotp', {
        email: email,
        otp: otp,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'OTP verified successfully!');
        // Navigate to the LoginScreen after successful OTP verification
        navigation.replace('Login');
      } else {
        Alert.alert('Error', 'OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during OTP verification. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>OTP Verification</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#405D72',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#405D72',
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#405D72',
  },
  button: {
    backgroundColor: '#405D72',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OTPVerificationScreen;

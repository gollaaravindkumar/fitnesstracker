import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Device from 'expo-device';
import axios from 'axios';

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    // Get device information on component mount
    const getDeviceInfo = () => {
      setDeviceInfo({
        deviceName: Device.modelName,
        deviceId: Device.deviceId,
        osName: Device.osName,
        osVersion: Device.osVersion,
      });
    };

    getDeviceInfo();
  }, []);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    try {
      // Send user data along with device information to your API
      const response = await axios.post('https://ngage.nexalink.co/health/users/signup', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        device_info: deviceInfo,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Signed up successfully!');
        // You can navigate to another screen here, e.g., navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Sign up failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during sign up. Please try again.');
    }
  };
  return (
    <LinearGradient
      colors={['#405D72', '#758694']}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.header}>Sign Up</Text>
        
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#ffffff" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#000"
            value={firstName}
            onChangeText={setFirstName}
        
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#ffffff" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
  placeholderTextColor="#000"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="#ffffff" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
  placeholderTextColor="#000"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#ffffff" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
  placeholderTextColor="#000"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    elevation: 5, // shadow for Android
    shadowColor: '#000000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#405D72',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#405D72',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
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

export default SignUpScreen;

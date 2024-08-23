import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SignInSignUpScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setName('');
    setAge('');
  };

  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get('http://10.2.19.199:5600/user-details', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert('Error', 'Failed to fetch user details.');
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!name || !age) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
  
    setLoading(true);
    try {
      const endpoint = isSignUp
        ? 'http://10.2.19.199:5600/signup'
        : 'http://10.2.19.199:5600/signin';
  
      const response = await axios.post(endpoint, { name, age });
  
      if (response.status === 200) {
        const { token } = response.data;
        await AsyncStorage.setItem('userData', JSON.stringify({ name, age, token }));
        const userDetails = await fetchUserDetails(token);
        if (userDetails) {
          Alert.alert('Success', isSignUp ? 'Sign up successful' : 'Sign in successful');
          navigation.replace('Home', { ...userDetails });
        }
      } else {
        Alert.alert('Error', 'There was a problem with the request');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'There was a problem with the request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>

      <TextInput
        style={styles.input}
        value={name}
        placeholder="Enter Your Name"
        placeholderTextColor="#000"
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        value={age}
        placeholder="Enter Your Age"
        placeholderTextColor="#000"
        onChangeText={(text) => setAge(text)}
        keyboardType="numeric"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
        <Text style={styles.toggleButtonText}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  toggleButton: {
    marginTop: 20,
  },
  toggleButtonText: {
    color: '#4CAF50',
    fontSize: 16,
  },
});

export default SignInSignUpScreen;

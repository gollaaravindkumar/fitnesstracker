import React, { useState, useEffect, useRef } from 'react';
import { Alert, StyleSheet, Text, View, FlatList, Dimensions, Button } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get("window");

export default function App() {

  const navigation = useNavigation();
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [stepsData, setStepsData] = useState([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [todayDate, setTodayDate] = useState('');
  const [todaySteps, setTodaySteps] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [intervalId, setIntervalId] = useState(null);
  
  const pedometerSubscriptionRef = useRef(null);

  useEffect(() => {
    const userDataFromParams = route.params;
    if (userDataFromParams) {
      setUserData(userDataFromParams);
      AsyncStorage.setItem('userData', JSON.stringify(userDataFromParams));
    } else {
      const checkUserData = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem('userData');
          if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
          } else {
            navigation.replace('Signin');
          }
        } catch (error) {
          console.error('Error reading user data from AsyncStorage:', error);
        }
      };
      checkUserData();
    }
  }, [route.params]);

  useEffect(() => {
    if (userData) {
      const end = new Date();
      const stopTime = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 2, 17, 0, 0); // Day after tomorrow at 5 PM
      
      const getSteps = async () => {
        const startOfDay = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 9, 0, 0); // Today at 9 AM
        const result = await Pedometer.getStepCountAsync(startOfDay, new Date());
        setTodaySteps(result.steps || 0);
        setTotalSteps(prev => prev + (result.steps || 0));

        await sendStepData(userData.id, result.steps || 0, new Date().toISOString().split('T')[0]);
      };

      const interval = setInterval(() => {
        if (new Date() >= stopTime) {
          clearInterval(interval);
        } else {
          getSteps();
        }
      }, 60000); // Fetch every minute

      setIntervalId(interval);

      return () => clearInterval(interval); // Clear interval when the component unmounts
    }
  }, [userData]);
  const sendStepData = async (userId, steps, date) => {
    try {
      const response = await axios.post('http://10.2.19.199:5600/steps', {
        userId,
        steps,
        date,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Step data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending step data:', error.response?.data || error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      clearInterval(intervalId); // Stop interval when signing out
      navigation.replace('Signin');
    } catch (error) {
      console.error('Error removing user data from AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userData?.name} ({userData?.age})!</Text>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Today's Date: {todayDate}</Text>
      <Text>Today's Steps: {todaySteps}</Text>
      <Text>Total steps: {totalSteps}</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

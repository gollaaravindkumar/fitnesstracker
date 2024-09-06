import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, Platform, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StepsContext } from '../Components/StepsContext';
import axios from 'axios';
import Constants from 'expo-constants';

// Define background fetch task
const BACKGROUND_FETCH_TASK = 'background-fetch-task';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log("Background fetch task running");
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Error during background fetch task:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Helper function to get Monday of the current week
const getMonday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + distanceToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

// Function to get all days of the current week (Monday to Sunday)
const getWeekDates = (startOfWeek) => {
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
};

// Function to fetch steps for all days in the current week
const fetchStepsForWeek = async (weekDates) => {
  const stepsPerDay = [];
  for (const date of weekDates) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    try {
      const result = await Pedometer.getStepCountAsync(startOfDay, endOfDay);
      stepsPerDay.push({
        day: startOfDay.toLocaleDateString('en-US', { weekday: 'long' }),
        steps: result.steps || 0,
      });
    } catch (error) {
      console.error(`Error fetching steps for ${date.toDateString()}:`, error);
      stepsPerDay.push({
        day: startOfDay.toLocaleDateString('en-US', { weekday: 'long' }),
        steps: 0,
      });
    }
  }
  return stepsPerDay;
};

const App = () => {
  const { setTodaySteps, setWeekSteps } = useContext(StepsContext);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [todaySteps, setTodayStepsLocal] = useState(0);
  const [weeklySteps, setWeeklySteps] = useState([]);
  const [rangeSteps, setRangeSteps] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await registerBackgroundFetch();
      const eventStartTime = await fetchAndStoreEventStartTime();
      await fetchWeeklyStepData(eventStartTime);
      await fetchTotalSteps();
      fetchUserData();
    };
    initializeApp();
  }, []);

  useEffect(() => {
    if (userData) {
      const startOfWeek = getMonday();
      const weekDates = getWeekDates(startOfWeek);

      const getWeeklySteps = async () => {
        const steps = await fetchStepsForWeek(weekDates);
        setWeeklySteps(steps);
        setWeekSteps(steps.map(day => day.steps)); // Update StepsContext
      };

      getWeeklySteps();
    }
  }, [userData]);

  const fetchAndStoreEventStartTime = async () => {
    try {
      const storedEventStartTime = await AsyncStorage.getItem('eventStartTime');
      let eventStartTime;

      if (!storedEventStartTime) {
        eventStartTime = new Date();
        eventStartTime.setHours(0, 0, 0, 0);
        await AsyncStorage.setItem('eventStartTime', eventStartTime.toISOString());
      } else {
        eventStartTime = new Date(storedEventStartTime);
      }
      return eventStartTime;
    } catch (error) {
      console.error("Error accessing event start time:", error);
    }
  };

  const fetchWeeklyStepData = async (eventStartTime) => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable ? 'available' : 'unavailable');

      if (isAvailable) {
        const weekDates = getWeekDates(getMonday());
        const stepsPerDay = await fetchStepsForWeek(weekDates);
        setWeeklySteps(stepsPerDay);
        setWeekSteps(stepsPerDay.map(day => day.steps)); // Update StepsContext
        await AsyncStorage.setItem('weeklySteps', JSON.stringify(stepsPerDay));
      }
    } catch (error) {
      console.error("Error fetching weekly step data:", error);
    }
  };

  const fetchTotalSteps = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
        const eventStartTime = await fetchAndStoreEventStartTime();
        const currentDate = new Date();
        const stepResult = await Pedometer.getStepCountAsync(eventStartTime, currentDate);
        setTodayStepsLocal(stepResult.steps);
        setTodaySteps(stepResult.steps); // Update StepsContext
      }
    } catch (error) {
      console.error("Error fetching total steps:", error);
    }
  };

  const fetchStepsBetweenDates = async (start, end) => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
        const stepResult = await Pedometer.getStepCountAsync(start, end);
        setRangeSteps(stepResult.steps);
      }
    } catch (error) {
      console.error("Error fetching steps between dates:", error);
    }
  };

  const registerBackgroundFetch = async () => {
    try {
      const status = await BackgroundFetch.getStatusAsync();
      if (status !== BackgroundFetch.Status.Available) {
        console.error("Background fetch is not available");
        return;
      }

      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 15, // 15 minutes
        stopOnTerminate: false, // iOS only
        startOnBoot: true, // Android only
      });
      console.log("Background fetch registered successfully");
    } catch (error) {
      console.error("Error registering background fetch:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      } else {
        // Navigate to Signin if no user data is found
        navigation.replace('Signin');
      }
    } catch (error) {
      console.error('Error reading user data from AsyncStorage:', error);
    }
  };

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
      navigation.replace('Signin');
    } catch (error) {
      console.error('Error removing user data from AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pedometer App</Text>
      <Text style={styles.text}>Today’s Steps: {todaySteps}</Text>
      {isPedometerAvailable === 'available' && (
        <>
          <Text style={styles.text}>Weekly Steps:</Text>
          {weeklySteps.map((day, index) => (
            <Text key={index} style={styles.text}>{day.day}: {day.steps}</Text>
          ))}
        </>
      )}
      <Button title="Fetch Steps" onPress={() => fetchStepsBetweenDates(startDate, endDate)} />
      <Button title="Sign Out" onPress={handleSignOut} />
      <DateTimePicker
        mode="date"
        display="default"
        value={startDate}
        onChange={(event, date) => setStartDate(date || startDate)}
      />
      <DateTimePicker
        mode="date"
        display="default"
        value={endDate}
        onChange={(event, date) => setEndDate(date || endDate)}
      />
      {rangeSteps !== null && (
        <Text style={styles.text}>Steps between dates: {rangeSteps}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 5,
  },
});

export default App;

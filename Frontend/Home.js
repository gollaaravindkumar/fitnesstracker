import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { StepsContext } from '../Components/StepsContext';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

const StepTracking = () => {
  const { setTodaySteps, setWeekSteps } = useContext(StepsContext);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [todaySteps, setTodayStepsLocal] = useState(null);
  const [weekSteps, setWeekStepsLocal] = useState(null);

  useEffect(() => {
    const initializeStepTracking = async () => {
      const storedDate = await fetchAndStoreInstallationDate();
      fetchStepData(storedDate);
      await registerBackgroundFetch();
    };

    initializeStepTracking();
  }, []);

  const fetchAndStoreInstallationDate = async () => {
    try {
      const storedDate = await AsyncStorage.getItem('installationDate');
      let installationDate;

      if (!storedDate) {
        installationDate = new Date();
        await AsyncStorage.setItem('installationDate', installationDate.toISOString());
      } else {
        installationDate = new Date(storedDate);
      }

      return installationDate;
    } catch (error) {
      console.error("Error accessing installation date:", error);
    }
  };

  const fetchStepData = async (installationDate) => {
    const currentDate = new Date();

    const startOfToday = new Date(currentDate);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable ? 'available' : 'unavailable');

      if (isAvailable) {
        // Fetch today's steps and add the current steps to it
        const todayStepResult = await Pedometer.getStepCountAsync(startOfToday, currentDate);
        const currentSteps = todayStepResult.steps;

        // Update today's steps with the current steps
        setTodaySteps(todayStepResult.steps);
        setTodayStepsLocal(todayStepResult.steps);

        // Fetch weekly steps
        const weekStepResult = await Pedometer.getStepCountAsync(startOfWeek, currentDate);
        setWeekSteps(weekStepResult.steps);
        setWeekStepsLocal(weekStepResult.steps);

        // Save step data to AsyncStorage to be accessed in background task
        await AsyncStorage.setItem('todaySteps', todayStepResult.steps.toString());
        await AsyncStorage.setItem('weekSteps', weekStepResult.steps.toString());
      }
    } catch (error) {
      console.error("Error fetching step data:", error);
    }
  };

  const registerBackgroundFetch = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 15, // Fetch every 15 minutes
        stopOnTerminate: false,   // Continue even after the app is terminated
        startOnBoot: true,        // Start background fetch when the device boots
      });
      console.log("Background fetch registered successfully");
    } catch (error) {
      console.error("Error registering background fetch:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Tracking</Text>
      <Text>Pedometer is {isPedometerAvailable}</Text>
      <Text>Today's Steps: {todaySteps !== null ? todaySteps : 'Loading...'}</Text>
      <Text>Current Week's Steps: {weekSteps !== null ? weekSteps : 'Loading...'}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default StepTracking;

// Task Manager to handle background fetch
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const storedDate = await AsyncStorage.getItem('installationDate');
    const installationDate = new Date(storedDate);
    const currentDate = new Date();
    const startOfToday = new Date(currentDate);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const todayStepResult = await Pedometer.getStepCountAsync(startOfToday, currentDate);
    const weekStepResult = await Pedometer.getStepCountAsync(startOfWeek, currentDate);
    await AsyncStorage.setItem('todaySteps', todayStepResult.steps.toString());
    await AsyncStorage.setItem('weekSteps', weekStepResult.steps.toString());
    console.log('Background fetch task executed');
    return BackgroundFetch.Result.NewData;
  } catch (error) {
    console.error("Error executing background fetch task:", error);
    return BackgroundFetch.Result.Failed;
  }
});
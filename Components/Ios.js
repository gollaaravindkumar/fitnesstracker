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
  const [eventActive, setEventActive] = useState(true);

  useEffect(() => {
    const initializeStepTracking = async () => {
      const storedDate = await fetchAndStoreInstallationDate();
      const { eventStart, eventEnd } = initializeEventDuration();
      checkEventStatus(eventStart, eventEnd);
      if (eventActive) {
        fetchStepData(storedDate);
        await registerBackgroundFetch(eventStart, eventEnd);
      }
    };

    initializeStepTracking();
    return () => {
      clearInterval(fetchInterval);
    };
  }, [eventActive]);

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

  const initializeEventDuration = () => {
    const now = new Date();

    const eventStart = new Date(now);
    eventStart.setHours(9, 0, 0, 0); // Set start time to 9 AM today

    const eventEnd = new Date(eventStart);
    eventEnd.setDate(eventEnd.getDate() + 2); // End 2 days later at 5 PM
    eventEnd.setHours(17, 0, 0, 0); // Set end time to 5 PM two days later

    return { eventStart, eventEnd };
  };

  const checkEventStatus = (eventStart, eventEnd) => {
    const now = new Date();
    if (now < eventStart || now > eventEnd) {
      setEventActive(false);
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
        // Fetch today's steps
        const todayStepResult = await Pedometer.getStepCountAsync(startOfToday, currentDate);
        setTodaySteps(todayStepResult.steps);
        setTodayStepsLocal(todayStepResult.steps);

        // Fetch weekly steps
        const weekStepResult = await Pedometer.getStepCountAsync(startOfWeek, currentDate);
        setWeekSteps(weekStepResult.steps);
        setWeekStepsLocal(weekStepResult.steps);

        // Save step data to AsyncStorage
        await AsyncStorage.setItem('todaySteps', todayStepResult.steps.toString());
        await AsyncStorage.setItem('weekSteps', weekStepResult.steps.toString());
      }
    } catch (error) {
      console.error("Error fetching step data:", error);
    }
  };

  let fetchInterval;

  const registerBackgroundFetch = async (eventStart, eventEnd) => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 1, // Fetch every 1 minute
        stopOnTerminate: false,   // Continue even after the app is terminated
        startOnBoot: true,        // Start background fetch when the device boots
      });
      console.log("Background fetch registered successfully");

      // Set interval to fetch steps every 5 minutes during event duration
      fetchInterval = setInterval(async () => {
        const now = new Date();
        if (now >= eventStart && now <= eventEnd) {
          await fetchStepData(await fetchAndStoreInstallationDate());
        } else {
          clearInterval(fetchInterval);
          setEventActive(false);
        }
      }, 60000); // Update every minute

    } catch (error) {
      console.error("Error registering background fetch:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Tracking</Text>
      <Text>Pedometer is {isPedometerAvailable}</Text>
      {eventActive ? (
        <>
          <Text>Today's Steps: {todaySteps !== null ? todaySteps : 'Loading...'}</Text>
          <Text>Current Week's Steps: {weekSteps !== null ? weekSteps : 'Loading...'}</Text>
        </>
      ) : (
        <Text>The event has ended. No more step data will be fetched.</Text>
      )}
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

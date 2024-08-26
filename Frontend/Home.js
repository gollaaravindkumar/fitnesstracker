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
  const [todaySteps, setTodayStepsLocal] = useState(0);
  const [weekSteps, setWeekStepsLocal] = useState(0);
  const [eventActive, setEventActive] = useState(true);

  useEffect(() => {
    const initializeStepTracking = async () => {
      const storedDate = await fetchAndStoreInstallationDate();
      const { eventStart, eventEnd } = initializeEventDuration();
      checkEventStatus(eventStart, eventEnd);
      if (eventActive) {
        await startPedometer();
        await registerBackgroundFetch(eventStart, eventEnd);
      }
    };

    initializeStepTracking();
    return () => {
      Pedometer.stopPedometerUpdatesAsync();
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

  const startPedometer = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable ? 'available' : 'unavailable');

      if (isAvailable) {
        Pedometer.watchStepCount(result => {
          setTodaySteps(prev => prev + result.steps);
          setTodayStepsLocal(prev => prev + result.steps);
          setWeekSteps(prev => prev + result.steps);
          setWeekStepsLocal(prev => prev + result.steps);

          AsyncStorage.setItem('todaySteps', (todaySteps + result.steps).toString());
          AsyncStorage.setItem('weekSteps', (weekSteps + result.steps).toString());
        });
      }
    } catch (error) {
      console.error("Error initializing pedometer:", error);
    }
  };

  const registerBackgroundFetch = async (eventStart, eventEnd) => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 1, // Fetch every 1 minute
        stopOnTerminate: false,   // Continue even after the app is terminated
        startOnBoot: true,        // Start background fetch when the device boots
      });
      console.log("Background fetch registered successfully");

      const fetchInterval = setInterval(async () => {
        const now = new Date();
        if (now >= eventStart && now <= eventEnd) {
          // Background fetch logic if needed
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

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // Implement background logic here if needed
    console.log('Background fetch task executed');
    return BackgroundFetch.Result.NewData;
  } catch (error) {
    console.error("Error executing background fetch task:", error);
    return BackgroundFetch.Result.Failed;
  }
});
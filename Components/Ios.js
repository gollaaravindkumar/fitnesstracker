import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StepsContext } from '../Components/StepsContext';

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

const StepTracking = () => {
  const { setTodaySteps, setWeekSteps } = useContext(StepsContext);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [todaySteps, setTodayStepsLocal] = useState(0);
  const [weeklySteps, setWeeklySteps] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [rangeSteps, setRangeSteps] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const initializeStepTracking = async () => {
      await registerBackgroundFetch();
      const eventStartTime = await fetchAndStoreEventStartTime();
      await fetchWeeklyStepData(eventStartTime);
      await fetchTotalSteps();
    };
    initializeStepTracking();
  }, []);

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
        const currentDate = new Date();
        const startOfWeek = new Date(eventStartTime);
        startOfWeek.setDate(eventStartTime.getDate() - eventStartTime.getDay() + 1); // Adjust to Monday
        startOfWeek.setHours(0, 0, 0, 0);

        const stepsPerDay = [];
        for (let i = 0; i < 7; i++) {
          const dayStart = new Date(startOfWeek);
          dayStart.setDate(startOfWeek.getDate() + i);
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);

          const stepResult = await Pedometer.getStepCountAsync(dayStart, dayEnd);
          stepsPerDay.push({
            day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
            steps: stepResult.steps,
          });
        }

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

  const onDateChange = (event, selectedDate, type) => {
    const currentDate = selectedDate || new Date();
    setShowPicker(Platform.OS === 'ios');
    if (type === 'start') {
      setStartDate(currentDate);
    } else {
      setEndDate(currentDate);
      fetchStepsBetweenDates(startDate, currentDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Tracking</Text>
      <Text>Pedometer is {isPedometerAvailable}</Text>

      <Button title="Pick Start Date" onPress={() => setShowPicker('start')} />
      <Button title="Pick End Date" onPress={() => setShowPicker('end')} />

      {showPicker === 'start' && (
        <DateTimePicker
          testID="startDateTimePicker"
          value={startDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => onDateChange(event, selectedDate, 'start')}
        />
      )}

      {showPicker === 'end' && (
        <DateTimePicker
          testID="endDateTimePicker"
          value={endDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => onDateChange(event, selectedDate, 'end')}
        />
      )}

      {rangeSteps !== null && (
        <Text>Steps between {startDate.toDateString()} and {endDate.toDateString()}: {rangeSteps}</Text>
      )}

      <Text>Steps this week:</Text>
      {weeklySteps.map((day, index) => (
        <Text key={index}>{day.day}: {day.steps} steps</Text>
      ))}

      <Text>Total steps since the event started: {todaySteps}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default StepTracking;

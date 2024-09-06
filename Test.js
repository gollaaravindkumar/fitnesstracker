import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StepsContext } from '../Components/StepsContext';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

// Only import AppleHealthKit for iOS
let AppleHealthKit;
if (Platform.OS === 'ios') {
  try {
    AppleHealthKit = require('react-native-health').default;
  } catch (error) {
    console.error("AppleHealthKit import error: ", error);
  }
}

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
  const [showPicker, setShowPicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
    const initializeStepTracking = async () => {
      try {
        setLoading(true);
        await registerBackgroundFetch();
        const eventStartTime = await fetchAndStoreEventStartTime();
        await fetchWeeklyStepData(eventStartTime);
        await fetchTotalSteps();
        setLoading(false);
      } catch (error) {
        console.error("Error initializing step tracking:", error);
        setLoading(false);
      }
    };

    initializeStepTracking();

    if (Platform.OS === "ios" && Constants.appOwnership !== 'expo' ) {
      initializeHealthKit();
    }

    Pedometer.isAvailableAsync().then(
      result => {
        setIsPedometerAvailable(result ? 'available' : 'not available');
      },
      error => {
        console.error("Error checking pedometer availability:", error);
        setIsPedometerAvailable('not available');
      }
    );
  }, []);

  const initializeHealthKit = () => {
    const permissions = {
      permissions: {
        read: ['StepCount'],
      },
    };
  
    AppleHealthKit.initHealthKit(permissions, (error) => {
      if (error) {
        console.log('Error initializing HealthKit: ', error);
        return;
      }
  
      const options = {
        startDate: new Date(2023, 7, 25).toISOString(),
      };
  
      AppleHealthKit.getStepCount(options, (err, results) => {
        if (err) {
          console.log('Error fetching step count: ', err);
          return;
        }
        setStepCount(results.value);
      });
    });
  };

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
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - (now.getDay() + 6) % 7); // Start of the week (Monday)
      startOfWeek.setHours(0, 0, 0, 0);

      const stepsPerDay = [];
      for (let i = 0; i < 7; i++) {
        const dayStart = new Date(startOfWeek);
        dayStart.setDate(startOfWeek.getDate() + i);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const stepResult = await Pedometer.getStepCountAsync(dayStart, dayEnd);
        stepsPerDay.push({
          day: dayStart.toLocaleDateString('en-US', { weekday: 'long' }),
          steps: stepResult.steps,
        });
      }

      setWeeklySteps(stepsPerDay);
      setWeekSteps(stepsPerDay.map(day => day.steps)); // Update StepsContext
      await AsyncStorage.setItem('weeklySteps', JSON.stringify(stepsPerDay));
    } catch (error) {
      console.error("Error fetching weekly step data:", error);
    }
  };

  const fetchTotalSteps = async () => {
    try {
      const eventStartTime = await fetchAndStoreEventStartTime();
      const currentDate = new Date();
      const stepResult = await Pedometer.getStepCountAsync(eventStartTime, currentDate);
      setTodayStepsLocal(stepResult.steps);
      setTodaySteps(stepResult.steps); // Update StepsContext
    } catch (error) {
      console.error("Error fetching total steps:", error);
    }
  };

  const fetchStepsBetweenDates = async (start, end) => {
    if (start <= end) {
      try {
        setLoading(true);
        const stepResult = await Pedometer.getStepCountAsync(start, end);
        setRangeSteps(stepResult.steps);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching steps between dates:", error);
        setLoading(false);
      }
    } else {
      console.error("Start date must be before end date.");
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
    setShowPicker('');
    if (type === 'start') {
      setStartDate(currentDate);
      if (endDate) {
        fetchStepsBetweenDates(currentDate, endDate);
      }
    } else {
      setEndDate(currentDate);
      if (startDate) {
        fetchStepsBetweenDates(startDate, currentDate);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Step Tracker</Text>
        <Text style={styles.pedometerStatus}>Pedometer is {isPedometerAvailable}</Text>
      </View>

      <View style={styles.dateButtons}>
        <TouchableOpacity style={styles.button} onPress={() => setShowPicker('start')}>
          <Text style={styles.buttonText}>Start Date: {startDate.toDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setShowPicker('end')}>
          <Text style={styles.buttonText}>End Date: {endDate.toDateString()}</Text>
        </TouchableOpacity>
      </View>

      {showPicker === 'start' && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, date) => onDateChange(event, date, 'start')}
        />
      )}
      {showPicker === 'end' && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, date) => onDateChange(event, date, 'end')}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.stepCount}>Today's Steps: {todaySteps}</Text>
          <FlatList
            data={weeklySteps}
            keyExtractor={(item) => item.day}
            renderItem={({ item }) => (
              <View style={styles.stepItem}>
                <Text style={styles.stepDay}>{item.day}</Text>
                <Text style={styles.stepCount}>{item.steps} steps</Text>
              </View>
            )}
          />
          {rangeSteps !== null && (
            <Text style={styles.stepCount}>
              Steps between selected dates: {rangeSteps}
            </Text>
          )}
          {stepCount > 0 && <Text style={styles.stepCount}>HealthKit Steps: {stepCount}</Text>}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pedometerStatus: {
    fontSize: 16,
    color: 'gray',
  },
  dateButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  stepCount: {
    fontSize: 18,
    marginVertical: 10,
  },
  stepItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  stepDay: {
    fontSize: 16,
  },
});

export default StepTracking;

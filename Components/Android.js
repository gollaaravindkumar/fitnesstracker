import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalState } from '../Frontend/GlobalState';
import TimePickerComponent from '../Frontend/TimePickerComponent';

const HomeScreen = ({ route, navigation }) => {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [dailySteps, setDailySteps] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [dailyStepRecord, setDailyStepRecord] = useGlobalState('dailyStepRecord');
  const [lastResetDate, setLastResetDate] = useState(null);
  const [startDate, setStartDate] = useGlobalState('startDate');
  const [endDate, setEndDate] = useGlobalState('endDate');
  const [isLoading, setIsLoading] = useState(true);
  const [totalStepsBetweenDates, setTotalStepsBetweenDates] = useState(null);
  const pedometerSubscriptionRef = useRef(null);
  // const { name, age } = route.params || {};

  const checkAndResetDailySteps = async () => {
    const currentDate = new Date();
    const lastReset = new Date(lastResetDate);

    if (!lastResetDate || (currentDate.getDate() !== lastReset.getDate()) || (currentDate.getMonth() !== lastReset.getMonth()) || (currentDate.getFullYear() !== lastReset.getFullYear())) {
      // Save the daily step record to AsyncStorage before resetting
      if (dailySteps > 0) {
        const newRecord = {
          date: lastResetDate ? lastResetDate.toISOString() : currentDate.toISOString(),
          steps: dailySteps,
        };

        const updatedRecords = [...dailyStepRecord, newRecord];
        setDailyStepRecord(updatedRecords);

        try {
          await AsyncStorage.setItem('dailyStepRecord', JSON.stringify(updatedRecords));
          console.log('Daily step record updated in AsyncStorage');
        } catch (error) {
          console.error('Error saving daily step record to AsyncStorage:', error);
        }
      }

      // Reset daily steps
      setDailySteps(0);
      await AsyncStorage.setItem('dailySteps', JSON.stringify(0)); // Updated: reset daily steps in AsyncStorage
      setLastResetDate(currentDate);
      await AsyncStorage.setItem('lastResetDate', currentDate.toISOString());
    }
  };

  useEffect(() => {
    // Save user data to AsyncStorage
    const saveUserData = async () => {
      try {
        if (name && age) {
          const userData = { name, age };
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          console.log("Saved User Data:", userData);
        }
      } catch (error) {
        console.error('Error saving user data to AsyncStorage:', error);
      }
    };

    saveUserData();
  },);
  
  useEffect(() => {
    const loadStepsData = async () => {
      try {
        const storedDailySteps = await AsyncStorage.getItem('dailySteps');
        const storedTotalSteps = await AsyncStorage.getItem('totalSteps');
        const storedLastResetDate = await AsyncStorage.getItem('lastResetDate');
        const storedDailyStepRecord = await AsyncStorage.getItem('dailyStepRecord');

        if (storedDailySteps !== null) {
          setDailySteps(parseInt(storedDailySteps));
          console.log("Loaded Daily Steps:", storedDailySteps);
        }

        if (storedTotalSteps !== null) {
          setTotalSteps(parseInt(storedTotalSteps));
          console.log("Loaded Total Steps:", storedTotalSteps);
        }

        if (storedLastResetDate !== null) {
          setLastResetDate(new Date(storedLastResetDate));
          console.log("Loaded Last Reset Date:", storedLastResetDate);
        }

        if (storedDailyStepRecord !== null) {
          const records = JSON.parse(storedDailyStepRecord);
          setDailyStepRecord(records);
          console.log("Loaded Daily Step Record:", records);
        }
      } catch (error) {
        console.error('Error loading step data from AsyncStorage:', error);
      }
      setIsLoading(false);
    };

    loadStepsData();
  }, []);

  useEffect(() => {
    const subscribeToPedometer = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
        const subscription = Pedometer.watchStepCount((result) => {
          setCurrentStepCount(result.steps);

          // Use functional update to ensure state is correctly updated
          setDailySteps(prevDailySteps => {
            const newDailySteps = prevDailySteps + 1;
            AsyncStorage.setItem('dailySteps', JSON.stringify(newDailySteps)); // Updated: save daily steps to AsyncStorage
            return newDailySteps;
          });

          setTotalSteps(prevTotalSteps => {
            const newTotalSteps = prevTotalSteps + 1;
            AsyncStorage.setItem('totalSteps', JSON.stringify(newTotalSteps)); // Updated: save total steps to AsyncStorage
            return newTotalSteps;
          });
        });
        pedometerSubscriptionRef.current = subscription;
      } else {
        Alert.alert('Error', 'Pedometer is not available on this device');
      }
    };

    subscribeToPedometer();

    return () => {
      if (pedometerSubscriptionRef.current && typeof pedometerSubscriptionRef.current.remove === 'function') {
        pedometerSubscriptionRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        checkAndResetDailySteps();
      }
      console.log("Checked");
    }, 10000); // Check every minute

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [lastResetDate, dailySteps, dailyStepRecord]);

  const calculateTotalStepsBetweenDates = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const stepsBetweenDates = dailyStepRecord.reduce((total, record) => {
      const recordDate = new Date(record.date);
      if (recordDate >= startDate && recordDate <= endDate) {
        return total + record.steps;
      }
      return total;
    }, 0);

    return stepsBetweenDates;
  };

  const handleDateRangeSelected = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
    const totalSteps = calculateTotalStepsBetweenDates(startDate, endDate);
    setTotalStepsBetweenDates(totalSteps);
  };

  const renderItem = ({ item }) => (
    <View style={styles.recordItem}>
      <Text style={styles.recordDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.recordSteps}>{item.steps} steps</Text>
    </View>
  );

  const renderContent = () => (
    <View style={styles.container}>
      {/* <Text>Welcome, {name}!</Text>
      <Text>Age: {age}</Text> */}
      <Text style={styles.header}>Home Screen</Text>
      <Text style={styles.stat}>Current Step Count: {currentStepCount}</Text>
      <Text style={styles.stat}>Daily Steps: {dailySteps}</Text>
      <Text style={styles.stat}>Total Steps: {totalSteps}</Text>
      <Text style={styles.stat}>
        Total Steps Between Dates: {totalStepsBetweenDates !== null ? totalStepsBetweenDates : 'Not calculated yet'}
      </Text>
      <TimePickerComponent onDateRangeSelected={handleDateRangeSelected} />
      <View style={styles.buttonContainer}>
        <Button title="Sign out" onPress={() => navigation.navigate('Signin')} />
        <Button title="Leaderboard" onPress={() => navigation.navigate("Leaderboard", { user: { name, age } })} />
        <Button title="Main User" onPress={() => navigation.navigate('MainUser')} />
      </View>
      <View style={styles.recordContainer}>
        <Text style={styles.recordHeader}>Daily Step Records</Text>
        <FlatList
          data={dailyStepRecord}
          renderItem={renderItem}
          keyExtractor={(item) => item.date + item.steps} // Ensure unique key
        />
      </View>
    </View>
  );
  
  return isLoading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <FlatList
      ListHeaderComponent={renderContent}
      contentContainerStyle={styles.flatListContainer}
      ListFooterComponent={<View style={styles.footer} />}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stat: {
    fontSize: 16,
    marginVertical: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  recordContainer: {
    marginTop: 20,
    width: '100%',
  },
  recordHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  recordDate: {
    fontSize: 16,
  },
  recordSteps: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    flexGrow: 1,
  },
  footer: {
    height: 20,  // to create some padding at the bottom
  },
});

export default HomeScreen;
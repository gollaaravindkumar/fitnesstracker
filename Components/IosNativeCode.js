import { Platform, StyleSheet, Text, View, SafeAreaView, FlatList, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import AppleHealthKit from 'react-native-health';
import { getWeekDays } from '../utils/utils'; // Utility file for common functions

const AppleHealthKitComponent = () => {
  const [weeklySteps, setWeeklySteps] = useState([]);
  const [totalSteps, setTotalSteps] = useState(0);
  const [error, setError] = useState(null);

  const processWeeklySteps = (results) => {
    const stepsByDay = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };

    let total = 0;

    results.forEach((sample) => {
      const date = new Date(sample.startDate);
      const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = dayMap[dayIndex];

      stepsByDay[dayName] += sample.value;
      total += sample.value;
    });

    const formattedSteps = Object.keys(stepsByDay).map(day => ({
      date: day,
      steps: stepsByDay[day],
    }));

    setWeeklySteps(formattedSteps);
    setTotalSteps(total);
  };

  const fetchCurrentWeekSteps = () => {
    const { monday, sunday } = getCurrentWeekRange();

    const options = {
      startDate: monday.toISOString(),
      endDate: sunday.toISOString(),
    };

    AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
      if (err) {
        console.error('Error fetching step count:', err);
        setError('Failed to fetch step count data.');
        return;
      }
      console.log('Step count data:', results); // Log the results for debugging
      processWeeklySteps(results);
    });
  };

  const getCurrentWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  useEffect(() => {
    if (Platform.OS === "ios" && Constants.appOwnership !== "expo") {
      const permissions = {
        permissions: {
          read: [AppleHealthKit.Constants.Permissions.StepCount],
        },
      };

      AppleHealthKit.initHealthKit(permissions, (error) => {
        if (error) {
          console.error('Error initializing HealthKit: ', error);
          setError('Failed to initialize HealthKit.');
          return;
        }

        fetchCurrentWeekSteps();
      });
    }
  }, []);

  const renderStepItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.date}</Text>
      <Text style={styles.count}>{item.steps} steps</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={weeklySteps}
            renderItem={renderStepItem}
            keyExtractor={(item) => item.date}
            contentContainerStyle={styles.list}
          />
          <View style={styles.footer}>
            <Text>Total Steps for the Week: {totalSteps} steps</Text>
            <Button title="Fetch Weekly Step Count" onPress={fetchCurrentWeekSteps} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  list: {
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default AppleHealthKitComponent;

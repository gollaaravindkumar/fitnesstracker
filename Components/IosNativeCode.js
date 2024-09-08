import { Platform, StyleSheet, Text, View, SafeAreaView, FlatList, Button } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import AppleHealthKit from 'react-native-health';
import Constants from 'expo-constants';
import { getWeekDays } from '../utils/utils';
import { StepsContext } from '../Components/StepsContext'; // Import the context
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook

const AppleHealthKitComponent = () => {
  const [realtimeSteps, setRealtimeSteps] = useState(0);
  const navigation = useNavigation();
  const { weeklySteps, setWeeklySteps, totalSteps, setTotalSteps } = useContext(StepsContext);

  const fetchWeeklySteps = async () => {
    const days = getWeekDays();
    let stepsData = [];
    let totalStepCount = 0;

    for (let day of days) {
      const start = new Date(day.setHours(0, 0, 0, 0));
      const end = new Date(day.setHours(23, 59, 59, 999));

      const options = {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };

      try {
        const result = await new Promise((resolve, reject) => {
          AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });

        const dailySteps = result.reduce((acc, item) => acc + item.value, 0);
        stepsData.push({ date: day.toDateString(), steps: dailySteps });
        totalStepCount += dailySteps;
      } catch (error) {
        console.error(`Error fetching step count for ${day.toDateString()}:`, error);
      }
    }

    setWeeklySteps(stepsData);
    setTotalSteps(totalStepCount);
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
          console.error('Error initializing HealthKit:', error);
          return;
        }

        fetchWeeklySteps();
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
      <FlatList
        data={weeklySteps}
        renderItem={renderStepItem}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.list}
      />
      <View style={styles.realtimeContainer}>
        <Text style={styles.realtimeTitle}>Real-Time Step Count</Text>
        <Text style={styles.realtimeCount}>{realtimeSteps} steps</Text>
      </View>
      <View style={styles.footer}>
        <Text>Total Steps for the Week: {totalSteps} steps</Text>
        <Button title="Fetch Weekly Step Count" onPress={fetchWeeklySteps} />
        <Button title="Go to LeaderBoard" onPress={() => navigation.navigate('LeaderBoard')} />
      </View>
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
  realtimeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  realtimeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  realtimeCount: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default AppleHealthKitComponent;

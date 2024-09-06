import { Platform, StyleSheet, Text, View, SafeAreaView, FlatList, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { getWeekDays } from '../utils/utils'; 
import Constants from 'expo-constants';// Utility file for common functions

const ExpoPedometer = () => {
  const [weeklySteps, setWeeklySteps] = useState([]);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [realtimeSteps, setRealtimeSteps] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  useEffect(() => {
    const subscribePedometer = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        let isSubscriptionActive = true;

        Pedometer.watchStepCount(result => {
          if (isSubscriptionActive) {
            setRealtimeSteps(result.steps);
          }
        });

        const days = getWeekDays();
        const stepsData = [];

        for (let day of days) {
          const start = new Date(day.setHours(0, 0, 0, 0));
          const end = new Date(day.setHours(23, 59, 59, 999));
          const result = await Pedometer.getStepCountAsync(start, end);

          if (result) {
            stepsData.push({ date: day.toDateString(), steps: result.steps });
          }
        }

        setWeeklySteps(stepsData);

        return () => {
          isSubscriptionActive = false;
        };
      }
    };

    if (Platform.OS === "ios" && Constants.appOwnership === "expo") {
      subscribePedometer();
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
        <Button title="Fetch Weekly Step Count" onPress={() => { /* Function to fetch weekly steps */ }} />
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

export default ExpoPedometer;

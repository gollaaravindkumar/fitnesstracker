import { Platform, StyleSheet, Text, View, SafeAreaView, FlatList, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Pedometer } from 'expo-sensors';
import Constants from 'expo-constants';
import { StepsContext } from '../Components/StepsContext';  // Adjust the path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ExpoPedometer = () => {
  const { weeklySteps, setWeeklySteps, totalSteps, setTotalSteps } = useContext(StepsContext);
  const [realtimeSteps, setRealtimeSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const navigation = useNavigation(); // Correctly use useNavigation hook

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
        setTotalSteps(stepsData.reduce((sum, item) => sum + item.steps, 0));

        return () => {
          isSubscriptionActive = false;
        };
      }
    };

    if (Platform.OS === "ios" && Constants.appOwnership === "expo") {
      subscribePedometer();
    }
  }, [setWeeklySteps, setTotalSteps]); // Add dependencies here

  const handlePress = () => {
    navigation.navigate('LeaderBoard');
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("ClearData");
      navigation.replace("Login");
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const renderStepItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.date}</Text>
      <Text style={styles.count}>{item.steps} steps</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={signOut}>
        <Text style={{ color: "red" }}>Sign Out</Text>
      </TouchableOpacity>
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
        <Button title="Go to LeaderBoard" onPress={handlePress} />
      </View>
    </SafeAreaView>
  );
};

const getWeekDays = () => {
  const today = new Date();
  const weekDays = [];

  // Find the start of the week (Monday)
  const firstDayOfWeek = today.getDate() - today.getDay() + 1; 
  const firstDate = new Date(today.setDate(firstDayOfWeek));

  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDate);
    date.setDate(firstDate.getDate() + i);
    weekDays.push(date);
  }

  return weekDays;
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

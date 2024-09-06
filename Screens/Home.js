import React, { useState, useEffect, useRef } from 'react';
import { Alert, StyleSheet, Text, View, FlatList, Dimensions, Button } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Make sure axios is imported

const { width } = Dimensions.get("window");

export default function App() {
  const route = useRoute();
  const navigation = useNavigation();

  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [stepsData, setStepsData] = useState([]);
  const [dailySteps, setDailySteps] = useState(0);
  const [weeklySteps, setWeeklySteps] = useState(0);
  const [monthlySteps, setMonthlySteps] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [todayDate, setTodayDate] = useState('');
  const [todaySteps, setTodaySteps] = useState(0);
  const [userData, setUserData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const pedometerSubscriptionRef = useRef(null);

  useEffect(() => {
    const userDataFromParams = route.params;
    if (userDataFromParams) {
      setUserData(userDataFromParams);
      AsyncStorage.setItem('userData', JSON.stringify(userDataFromParams));
    } else {
      const checkUserData = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem('userData');
          if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
          } else {
            navigation.replace('Signin');
          }
        } catch (error) {
          console.error('Error reading user data from AsyncStorage:', error);
        }
      };
      checkUserData();
    }
  }, [route.params]);

  useEffect(() => {
    if (userData) {
      const getStepsData = async () => {
        const end = new Date();
        const startOfMonth = new Date(end.getFullYear(), end.getMonth(), 1);
        const startOfWeek = new Date(end);
        startOfWeek.setDate(end.getDate() - end.getDay());
        const startOfDay = new Date(end);
        let dailyCount = 0;
        let weeklyCount = 0;
        let monthlyCount = 0;
        let totalCount = 0;
        let stepsArray = [];
        let todayStepsCount = 0;

        for (let day = startOfMonth.getDate(); day <= end.getDate(); day++) {
          const startDay = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), day);
          const endDay = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), day + 1);

          const result = await Pedometer.getStepCountAsync(startDay, endDay);
          const steps = result.steps || 0;
          stepsArray.push({
            date: startDay.toISOString().split('T')[0],
            steps
          });

          if (startDay.toDateString() === end.toDateString()) {
            todayStepsCount = steps;
            setTodayDate(startDay.toISOString().split('T')[0]);
            setTodaySteps(todayStepsCount);
          }

          if (startDay >= startOfDay) {
            dailyCount += steps;
          }
          if (startDay >= startOfWeek) {
            weeklyCount += steps;
          }
          monthlyCount += steps;
          totalCount += steps;
        }

        setStepsData(stepsArray);
        setDailySteps(dailyCount);
        setWeeklySteps(weeklyCount);
        setMonthlySteps(monthlyCount);
        setTotalSteps(totalCount);

        // Send step data to the backend
        await sendStepData(
          userData.id,
          totalCount,
          dailyCount,
          weeklyCount,
          monthlyCount,
          todayDate
        );
      };

      const subscribe = async () => {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(String(isAvailable));
        if (isAvailable) {
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - 1);
          const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
          if (pastStepCountResult) {
            setCurrentStepCount(pastStepCountResult.steps);
          }
          const subscription = Pedometer.watchStepCount(result => {
            setCurrentStepCount(result.steps);
          });
          pedometerSubscriptionRef.current = subscription;
        } else {
          Alert.alert('Error', 'Pedometer is not available on this device');
        }
      };

      subscribe().then(() => {
        getStepsData();
      });

      return () => {
        if (
          pedometerSubscriptionRef.current &&
          typeof pedometerSubscriptionRef.current.remove === 'function'
        ) {
          pedometerSubscriptionRef.current.remove();
        }
      };
    }
  }, [userData]);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('http://10.2.19.199:5600/leaderboard');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error.message);
      setLeaderboardData([]);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      navigation.replace('Signin');
    } catch (error) {
      console.error('Error removing user data from AsyncStorage:', error);
    }
  };

  // Define the sendStepData function
  const sendStepData = async (userId, totalSteps, dailySteps, weeklySteps, monthlySteps, date) => {
    try {
      const response = await axios.post('http://10.2.19.199:5600/steps', {
        userId,
        totalSteps,
        dailySteps,
        weeklySteps,
        monthlySteps,
        date
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Step data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending step data:', error.response?.data || error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {userData?.name} ({userData?.age})!</Text>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Steps taken as of now: {currentStepCount}</Text>
      <Text>Today's Date: {todayDate}</Text>
      <Text>Today's Steps: {todaySteps}</Text>
      <Text>Daily steps: {dailySteps}</Text>
      <Text>Weekly steps: {weeklySteps}</Text>
      <Text>Monthly steps: {monthlySteps}</Text>
      <Text>Total steps: {totalSteps}</Text>
      <FlatList
        data={stepsData}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.stepItem}>
            <Text style={styles.stepDate}>{item.date}</Text>
            <Text style={styles.stepCount}>{item.steps}</Text>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
      <Text style={styles.title}>Leaderboard</Text>
      {loadingLeaderboard ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={leaderboardData}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.leaderboardItem}>
              <Text style={styles.leaderboardName}>{item.name}</Text>
              <Text style={styles.leaderboardSteps}>{item.total_steps}</Text>
              <Text style={styles.leaderboardSteps}>{item.rank}</Text>
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
        />
      )}
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stepItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: width * 0.9,
  },
  stepDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepCount: {
    fontSize: 14,
  },
  leaderboardItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: width * 0.9,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaderboardSteps: {
    fontSize: 14,
  },
  flatListContent: {
    width: width * 0.9,
  },
});

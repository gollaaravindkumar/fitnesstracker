import { Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StepsContext } from '../Components/StepsContext'; 

const StepTracking = () => {
  const { setTodaySteps, setWeekSteps, setMonthSteps } = useContext(StepsContext);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [todaySteps, setTodayStepsLocal] = useState(null);
  const [weekSteps, setWeekStepsLocal] = useState(null);
  const [monthSteps, setMonthStepsLocal] = useState(null);
  const [isEventActive, setIsEventActive] = useState(true);

  useEffect(() => {
    const startEventTime = new Date();
    startEventTime.setHours(9, 0, 0, 0); // Event starts at 9 AM today

    const endEventTime = new Date();
    endEventTime.setDate(endEventTime.getDate() + 1); // Ends two days after
    endEventTime.setHours(17, 0, 0, 0); // Ends at 5 PM

    const fetchStepData = async () => {
      const currentDate = new Date();
      const startOfToday = new Date(currentDate);
      startOfToday.setHours(0, 0, 0, 0);

      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(isAvailable ? 'available' : 'unavailable');

        if (isAvailable && isEventActive) {
          // Adjusting the step count fetching based on platform if necessary
          if (Platform.OS === 'android') {
            // Android-specific logic if needed
          } else if (Platform.OS === 'ios') {
            // iOS-specific logic if needed
          }

          const todayStepResult = await Pedometer.getStepCountAsync(startOfToday, currentDate);
          setTodaySteps(todayStepResult.steps);
          setTodayStepsLocal(todayStepResult.steps);

          const weekStepResult = await Pedometer.getStepCountAsync(startOfWeek, currentDate);
          setWeekSteps(weekStepResult.steps);
          setWeekStepsLocal(weekStepResult.steps);

          const monthStepResult = await Pedometer.getStepCountAsync(startOfMonth, currentDate);
          setMonthSteps(monthStepResult.steps);
          setMonthStepsLocal(monthStepResult.steps);
        }
      } catch (error) {
        console.error("Error fetching step data: ", error);
      }
    };

    fetchStepData();
    const interval = setInterval(() => {
      const now = new Date();
      if (now >= endEventTime) {
        setIsEventActive(false);
        clearInterval(interval);
      } else {
        fetchStepData();
      }
    }, 60000); // Fetch every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Tracking</Text>
      <Text>Pedometer is {isPedometerAvailable}</Text>
      {isEventActive ? (
        <>
          <Text>Today's Steps: {todaySteps !== null ? todaySteps : 'Loading...'}</Text>
          <Text>Current Week's Steps: {weekSteps !== null ? weekSteps : 'Loading...'}</Text>
          <Text>Current Month's Steps: {monthSteps !== null ? monthSteps : 'Loading...'}</Text>
        </>
      ) : (
        <Text>The event has ended.</Text>
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

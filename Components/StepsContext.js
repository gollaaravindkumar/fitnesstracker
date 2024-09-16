import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const StepsContext = createContext();

export const StepsProvider = ({ children }) => {
  const [goal, setGoal] = useState(1000);
  const [weeklySteps, setWeeklySteps] = useState([
    { day: 'Mon', steps: 8000 },
    { day: 'Tue', steps: 9000 },
    { day: 'Wed', steps: 7000 },
    { day: 'Thu', steps: 10000 },
    { day: 'Fri', steps: 12000 },
    { day: 'Sat', steps: 15000 },
    { day: 'Sun', steps: 14000 },
  ]);

  const loadGoal = async () => {
    try {
      const savedGoal = await AsyncStorage.getItem('stepGoal');
      if (savedGoal !== null) {
        setGoal(parseInt(savedGoal));
      }
    } catch (error) {
      console.error('Error loading goal:', error);
    }
  };

  const saveGoal = async (newGoal) => {
    try {
      await AsyncStorage.setItem('stepGoal', newGoal.toString());
      setGoal(newGoal);
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  useEffect(() => {
    loadGoal();
  }, []);

  return (
    <StepsContext.Provider value={{ goal, setGoal: saveGoal, weeklySteps }}>
      {children}
    </StepsContext.Provider>
  );
};

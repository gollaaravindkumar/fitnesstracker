import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';

const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.Steps],
  },
};

const WeeklyStepCount = () => {
  const [weeklySteps, setWeeklySteps] = useState({
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  });
  const [totalSteps, setTotalSteps] = useState(0);

  useEffect(() => {
    AppleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        console.log('Error initializing HealthKit:', err);
        return;
      }
      fetchCurrentWeekSteps();
    });
  }, []);

  // Function to get the current week's Monday and Sunday dates
  const getCurrentWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) - 6 (Saturday)

    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Adjust to Monday

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6); // Sunday is 6 days after Monday

    return { monday, sunday };
  };

  const fetchCurrentWeekSteps = () => {
    const { monday, sunday } = getCurrentWeekRange();

    const options = {
      startDate: monday.toISOString(), // Start date (this Monday)
      endDate: sunday.toISOString(),   // End date (this Sunday)
    };

    AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
      if (err) {
        console.log('Error fetching step count:', err);
        return;
      }
      processWeeklySteps(results);
    });
  };

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

      // Sum steps per day
      stepsByDay[dayName] += sample.value;
      total += sample.value; // Accumulate total steps
    });

    setWeeklySteps(stepsByDay); // Update steps per day in state
    setTotalSteps(total);       // Store the total step count
  };

  return (
    <View>
      <Text>Weekly Step Counts:</Text>
      {Object.entries(weeklySteps).map(([day, steps], index) => (
        <Text key={index}>
          {day}: {steps} steps
        </Text>
      ))}
      <Text>Total Steps for the Week: {totalSteps} steps</Text>
      <Button title="Fetch Weekly Step Count" onPress={fetchCurrentWeekSteps} />
    </View>
  );
};

export default WeeklyStepCount;

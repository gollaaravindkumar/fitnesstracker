import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { StepsContext } from '../path-to-context/StepsContext';

const SetGoal = () => {
  const { goal, setGoal } = useContext(StepsContext);
  const [newGoal, setNewGoal] = useState('');

  const handleSetGoal = () => {
    if (newGoal) {
      setGoal(parseInt(newGoal)); // Save goal to context and AsyncStorage
      setNewGoal('');
    }
  };

  return (
    <View>
      <Text>Current goal: {goal} steps</Text>
      <TextInput
        value={newGoal}
        placeholder="Set a new goal"
        keyboardType="numeric"
        onChangeText={setNewGoal}
      />
      <Button title="Set Goal" onPress={handleSetGoal} />
    </View>
  );
};

export default SetGoal;

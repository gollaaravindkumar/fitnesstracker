import React, { useState } from 'react';
import { View, Button, Platform, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGlobalState, setGlobalState } from './GlobalState';

const TimePickerComponent = ({ onDateRangeSelected }) => {
  const [startDate] = useGlobalState("startDate");
  const [endDate] = useGlobalState("endDate");
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState('date');
  const [isStartDate, setIsStartDate] = useState(true);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();

    if (isStartDate) {
      setGlobalState("startDate", currentDate);
    } else {
      setGlobalState("endDate", currentDate);
    }

    setShowPicker(false);
  };

  const showDatePicker = (isStart) => {
    setIsStartDate(isStart);
    setMode('date');
    setShowPicker(true);
  };

  const isValidRange = () => {
    if (!startDate || !endDate) return false;
    return startDate <= endDate;
  };

  const handleCalculate = () => {
    if (isValidRange() && onDateRangeSelected) {
      onDateRangeSelected(startDate, endDate);
    }
  };

  return (
    <View>
      <Button onPress={() => showDatePicker(true)} title="Select Start Date" />
      <Button onPress={() => showDatePicker(false)} title="Select End Date" />

      <Text>Start Date: {startDate ? startDate.toDateString() : 'Not selected'}</Text>
      <Text>End Date: {endDate ? endDate.toDateString() : 'Not selected'}</Text>

      {!isValidRange() && startDate && endDate && (
        <Text style={{ color: 'red' }}>End date must be after start date</Text>
      )}

      <Button onPress={handleCalculate} title="Calculate Steps" disabled={!isValidRange()} />

      {showPicker && (
        <DateTimePicker
          value={isStartDate ? (startDate || new Date()) : (endDate || new Date())}
          mode={mode}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default TimePickerComponent;
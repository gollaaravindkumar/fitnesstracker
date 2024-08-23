// DateRangePicker.js
import React from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const DateRangePicker = 
({ 
  startDate, 
  endDate, 
  isStartPickerVisible, 
  isEndPickerVisible, 
  setStartDate, 
  setEndDate, 
  setStartPickerVisible, 
  setEndPickerVisible 
}) => {
  return (
    <View style={styles.dateRangeContainer}>
      {/* Start Date Input */}
      <View style={styles.dateInputContainer}>
        <Text style={styles.dateLabel}>Start Date</Text>
        <View style={styles.dateInput}>
          <TextInput
            style={styles.dateInputField}
            placeholder={moment(startDate).format('MM/DD/YYYY')}
            placeholderTextColor="#999" // Optional: Light color for placeholder text
            editable={false}
          />
          <Feather name="calendar" size={20} style={styles.calendarIcon} onPress={() => setStartPickerVisible(true)} />
        </View>
      </View>

      {/* End Date Input */}
      <View style={styles.dateInputContainer}>
        <Text style={styles.dateLabel}>End Date</Text>
        <View style={styles.dateInput}>
          <TextInput
            style={styles.dateInputField}
            placeholder={moment(endDate).format('MM/DD/YYYY')}
            placeholderTextColor="#999" // Optional: Light color for placeholder text
            editable={false}
          />
          <Feather name="calendar" size={20} style={styles.calendarIcon} onPress={() => setEndPickerVisible(true)} />
        </View>
      </View>

      {/* Date Pickers */}
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="date"
        date={startDate}
        onConfirm={(date) => {
          setStartDate(date);
          setStartPickerVisible(false);
        }}
        onCancel={() => setStartPickerVisible(false)}
      />
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="date"
        date={endDate}
        onConfirm={(date) => {
          setEndDate(date);
          setEndPickerVisible(false);
        }}
        onCancel={() => setEndPickerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dateRangeContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateInputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3E3E3',
    borderRadius: 5,
    padding: 10,
  },
  dateInputField: {
    flex: 1,
    color: '#000', // Set the text color to black
  },
  calendarIcon: {
    marginLeft: 10,
  },
});

export default DateRangePicker;

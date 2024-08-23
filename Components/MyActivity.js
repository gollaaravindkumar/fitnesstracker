import React, { useContext } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { StepsContext } from '../Components/StepsContext';

const screenWidth = Dimensions.get('window').width;

const MyActivity = () => {
  const { weekSteps ,todaySteps} = useContext(StepsContext);
  const validatedWeekSteps = Array.isArray(weekSteps) && weekSteps.length === 7
    ? weekSteps
    : [0, 0, 0, 0, 0, 0, 0]; // Default value if data is invalid

  // Chart data
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [weekSteps], // Corrected line
      },
    ],
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Activity</Text>
      <BarChart
        data={data}
        width={screenWidth - 32}
        height={220}
        fromZero={true} // Start the y-axis from zero
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBars: {
            borderRadius: 6,
            color: '#ffa726',
          },
          propsForLabels: {
            fontSize: 12,
            color: '#000',
          },
          yAxisLabel: '',
          yAxisSuffix: 'k',
          yAxisInterval: 1, // Controls the spacing between y-axis labels
        }}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
});
export default MyActivity;

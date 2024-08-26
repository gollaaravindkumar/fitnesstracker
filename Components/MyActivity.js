import React, { useContext } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { StepsContext } from '../Components/StepsContext';

const screenWidth = Dimensions.get('window').width;

const MyActivity = () => {
  const { weekSteps } = useContext(StepsContext);
  const validatedWeekSteps = Array.isArray(weekSteps) && weekSteps.length === 7
    ? weekSteps
    : [0, 0, 0, 0, 0, 0, 0]; // Default value if data is invalid

  // Chart data
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: validatedWeekSteps, // Use validated weekly steps data
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Activity</Text>
      <BarChart
        data={data}
        width={screenWidth - 32} // Subtract padding
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffc107',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          barPercentage: 0.5,
          useShadowColorFromDataset: false,
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
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default MyActivity;

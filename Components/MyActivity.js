import React, { useContext } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { StepsContext } from '../Components/StepsContext'; // Ensure correct path to StepsContext
import { BarChart } from 'react-native-chart-kit';


const MyActivity = () => {
  const { weeklySteps = [], goal = 0 } = useContext(StepsContext);

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const stepsData = weeklySteps.map(step => step.steps || 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Activity</Text>
      <Text style={styles.goalText}>Your Step Goal: {goal} steps</Text>
      <View style={styles.chartContainer}>
        <BarChart
          data={{
            labels: labels,
            datasets: [
              {
                data: stepsData,
              },
            ],
          }}
          width={Dimensions.get('window').width - 16} // Adjust width to fit
          height={220}
          yAxisLabel=""
          yAxisSuffix=" steps"
          chartConfig={{
            backgroundColor: '#f8f9fa',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#f8f9fa',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(33, 37, 41, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForBackgroundLines: {
              strokeDasharray: '', // Solid lines
            },
          }}
          verticalLabelRotation={30} // Rotate labels for better fit
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    width: '100%',
    padding: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20,
    textAlign: 'center',
  },
  goalText: {
    fontSize: 18,
    color: '#343a40',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default MyActivity;

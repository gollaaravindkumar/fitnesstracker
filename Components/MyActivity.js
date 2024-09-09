import React, { useContext } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { StepsContext } from '../Components/StepsContext'; // Use named import
import { BarChart } from 'react-native-chart-kit';

const MyActivity = () => {
  const { weeklySteps } = useContext(StepsContext);

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; 
  const stepsData = weeklySteps.map(step => step.steps);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Activity</Text>
      <View style={styles.chartContainer}>
        <BarChart
        scrollEnabled={true}
          data={{
            labels: labels,
            datasets: [
              {
                data: stepsData,
              },
            ],
          }}
          width={Dimensions.get('window').width}// Increase width to fit all bars
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#f8f9fa',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#f8f9fa',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(33, 37, 41, ${opacity})`,
            style: {
              borderRadius: 16,
              borderWidth: 0,
        
            },
            propsForLabels: {
              fontSize: '12',
              fontWeight: 'bold',
              color: '#333',

            },
            propsForBackgroundLines: {
              strokeDasharray: '', // solid lines
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          verticalLabelRotation={30} // Rotate labels for better fit
        />
      </View>
      {/* <View style={styles.dataContainer}>
        {weeklySteps.map((steps, index) => (
          <View key={index} style={styles.stepItem}>
            <Text style={styles.stepText}>
              {labels[index]}: {steps.steps} steps
            </Text>
          </View>
        ))}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    width: '100%',
 // Adjust horizontal margin to center content
   
    marginRight:40, // Add padding to ensure content is not too close to the edges
    borderRadius: 10, // Optional: add border radius for a softer look
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40', // Darker text color
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  dataContainer: {
    width: '100%',
  },
  stepItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6', // Light border color
    paddingHorizontal: 0,
  },
  stepText: {
    fontSize: 16,
    color: '#495057', // Text color for steps
  },
});

export default MyActivity;

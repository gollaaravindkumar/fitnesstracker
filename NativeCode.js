 import React, { useState, useEffect } from 'react';
 import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
 import AppleHealthKit from 'react-native-health';

 const StepCounter = () => {
   const [stepCount, setStepCount] = useState(0);

   useEffect(() => {
     const permissions = {
       permissions: {
         read: ['StepCount'],
       },
     };

     AppleHealthKit.initHealthKit(permissions, (error) => {
       if (error) {
         console.log('Error initializing HealthKit: ', error);
         return;
       }

       const options = {
         startDate: new Date(2023, 7, 25).toISOString(),  
         
       };

       AppleHealthKit.getStepCount(options, (err, results) => {
         if (err) {
           console.log('Error fetching step count: ', err);
           return;
         }
         setStepCount(results.value);
       });
     });
   }, []);
   return (
     <SafeAreaView style={styles.container}>
       <View style={styles.card}>
         <Text style={styles.title}>Today's Step Count</Text>
         <Text style={styles.count}>{stepCount}</Text>
       </View>
     </SafeAreaView>
   );
 };

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#F5FCFF',
   },
   card: {
     backgroundColor: '#FFF',
     padding: 20,
     borderRadius: 10,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.3,
     shadowRadius: 5,
     elevation: 5,
     alignItems: 'center',
   },
   title: {
     fontSize: 24,
     color: '#333',
     marginBottom: 10,
     fontWeight: 'bold',
   },
   count: {
     fontSize: 48,
     color: '#4CAF50',
     fontWeight: 'bold',
   },
 });

 export default StepCounter;

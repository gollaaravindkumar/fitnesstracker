import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import AndroidStep from '../Components/Android';
import Ios from '../Components/Ios';

const Home = () => {
  const [step, setStep] = useState(false);
  if (Platform.OS === 'ios') {
    return (
      <View style={styles.container}>
        <Ios />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {step ? <Ios /> : <AndroidStep />}
      </View>
    );
  }
};
export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

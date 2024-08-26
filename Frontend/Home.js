import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import AndroidStep from '../Components/Android';
import Ios from '../Components/Ios';

const Home = () => {
  const [step, setStep] = useState(false);
  if (Platform.OS === 'ios') {
    return (
      
        <Ios/>

    );
  } else {
    return (
      < >
        {step ? <Ios /> : <AndroidStep />}
      </>
    );
  }
};
export default Home;


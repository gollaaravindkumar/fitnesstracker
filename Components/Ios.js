import React from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import ExpoPedometer from '../Components/IosExpoCode';
import AppleHealthKitComponent from '../Components/IosNativeCode';

const MainIos = () => {
  if (Platform.OS === 'ios') {
    if (Constants.appOwnership === 'expo') {
      return <ExpoPedometer />;
    } else {
      return <AppleHealthKitComponent />;
    }
  }
  return null; 
};
export default MainIos;

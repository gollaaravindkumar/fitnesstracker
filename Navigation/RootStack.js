import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Components/Home';
import LeaderBoard from '../Screens/LeaderBoard';
import MainUserdata from '../Components/MainUser';
import SignUp from '../Screens/SignUp'
import RootTab from '../Navigation/RootTab'
import Login from '../Screens/Login'
import IosExpoCode from '../Components/IosExpoCode'
import optScreen from '../Screens/OTPVerificationScreen'


const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name='RootTab' component={RootTab} />
      <Stack.Screen name='LeaderBoard' component={LeaderBoard} />
      <Stack.Screen name='MainUserdata' component={MainUserdata} />
      <Stack.Screen name='SignUp' component={SignUp} />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='IosExpoCode' component={IosExpoCode} />
      <Stack.Screen name='OTPVerification' component={optScreen} />
    </Stack.Navigator>  
  )
}
export default RootStack

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Components/Home';
import LeaderBoard from '../Screens/LeaderBoard';
import MainUserdata from '../Components/MainUser';
import UserSignin from '../Screens/UserSignIn';
import SignUp from '../Screens/SignUp'
import RootTab from '../Navigation/RootTab'
import Login from '../Screens/Login'
import IosExpoCode from '../Components/IosExpoCode'

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name='RootTab' component={RootTab} />
      <Stack.Screen name='LeaderBoard' component={LeaderBoard} />
      <Stack.Screen name='MainUserdata' component={MainUserdata} />
      <Stack.Screen name='UserSignin' component={UserSignin} />
      <Stack.Screen name='SignUp' component={SignUp} />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='IosExpoCode' component={IosExpoCode} />
    </Stack.Navigator>  

  )
}
export default RootStack

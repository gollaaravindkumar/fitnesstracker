import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Components/Home';
import LeaderBoard from '../Screens/LeaderBoard';
import MainUserdata from '../Components/MainUser';
import UserSignin from '../Screens/UserSignIn';
import SignUp from '../Screens/SignUp'


const Stack = createNativeStackNavigator();


const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='LeaderBoard' component={LeaderBoard} />
      <Stack.Screen name='MainUserdata' component={MainUserdata} />
      <Stack.Screen name='UserSignin' component={UserSignin} />
      <Stack.Screen name='SignUp' component={SignUp} />
    </Stack.Navigator>  

  )
}
export default RootStack

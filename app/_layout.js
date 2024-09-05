// import { StyleSheet, View, Text } from 'react-native';
// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from '@react-navigation/native';
// import Home from '../Components//Home';
// import LeaderBoard from '../Screens/LeaderBoard';
// import MainUserdata from '../Components/MainUser'
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { StepsProvider } from '../Components/StepsContext';
// import UserSignin from '../Screens/UserSignIn'

// const TopBotton = createMaterialTopTabNavigator();
// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// function HomeScreen() {
//   return (
//     <View style={styles.container}>
//       <Text>Home Screen</Text>
//     </View>
//   );
// }

// function SettingsScreen() {
//   return (
//     <View style={styles.container}>
//       <Text>Settings Screen</Text>
//     </View>
//   );
// }

// function MyTabs() {
//   return (
//     <>
//       <Tab.Navigator
//         screenOptions={{
//           tabBarActiveTintColor: 'tomato',
//           tabBarInactiveTintColor: 'gray',
//           tabBarLabelStyle: { fontSize: 12 },
//           tabBarIndicatorStyle: { backgroundColor: 'tomato' },
//         }}
//       >
//         <Tab.Screen name="Home" component={HomeScreen} />
//         <Tab.Screen name="Settings" component={SettingsScreen} />
//       </Tab.Navigator>
//     </>
//   );
// }
// function HomeStack() {
//   return (
//     <Stack.Navigator initialRouteName='Home'>
//       <Stack.Screen name='Home' component={Home} />
//       <Stack.Screen name='LeaderBoard' component={LeaderBoard} />
//       <Stack.Screen name='MainUserdata' component={MainUserdata} />
//       <Stack.Screen name='MainUserdata' component={UserSignin} />
//     </Stack.Navigator>
//   );
// }
// function LeaderBoardStack() {
//   return (
//     <Stack.Navigator initialRouteName='LeaderBoard'>
//       <Stack.Screen name='Home' component={Home} />
//       <Stack.Screen name='LeaderBoard' component={LeaderBoard} />
//        <Stack.Screen name='MainUserdata' component={MainUserdata} />
//     </Stack.Navigator>
//   );
// }

// function TabStack() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           if (route.name === "Home") {
//             return (
//               <MaterialCommunityIcons
//                 name={focused ? "home-variant" : "home-variant-outline"}
//                 size={size}
//                 color={color}
//               />
//             );
//           } else if (route.name === "LeaderBoard") {
//             return (
//               <FontAwesome6
//                 name="ranking-star"
//                 size={20}
//                 color={color}
//               />
//             );
//           }
//         },
//         tabBarActiveTintColor: "#0047A1",
//         tabBarInactiveTintColor: "#7C7C7C",
//       })}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeStack}
//         options={{ headerShown: false }}
//       />
//       <Tab.Screen
//         name="LeaderBoard"
//         component={LeaderBoardStack}
//         options={{ headerShown: false }}
//       />
//     </Tab.Navigator>
//   );
// }

// const Layout = () => {
//   return (
//     <StepsProvider>
//       <NavigationContainer independent={true}>
//         <TabStack />
//       </NavigationContainer>
//     </StepsProvider>
//   );
// }

// export default Layout;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });



import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RootStack from '../Navigation/RootStack'

const _layout = () => {
  return (
    <>
    <RootStack/>
    </>
  )
}

export default _layout

const styles = StyleSheet.create({})
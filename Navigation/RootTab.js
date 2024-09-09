// TabRoot.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Frontend/Home'; // Example Tab screen
import LeaderBoardScreen from '../Screens/LeaderBoard'; // Example Tab screen
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icons you need
const Tab = createBottomTabNavigator();
const TabRoot = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home'; // Adjust icon based on the focus state
          } else if (route.name === 'LeaderBoard') {
            iconName = focused ? 'trophy' : 'trophy'; // Adjust icon based on the focus state
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato', // Color for active tab
        tabBarInactiveTintColor: 'gray', // Color for inactive tab
        headerShown: false
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="LeaderBoard" component={LeaderBoardScreen} />
    </Tab.Navigator>
  );
};

export default TabRoot;

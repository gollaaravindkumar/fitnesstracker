import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from '../Screens/Home';
import LeaderBoardStack from '../Screens/LeaderBoard';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

function TabStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return (
              <MaterialCommunityIcons
                name={focused ? "home-variant" : "home-variant-outline"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "LeaderBoard") {
            return (
              <FontAwesome6
                name="ranking-star"
                size={20}
                color={color}
              />
            );
          }
        },
        tabBarActiveTintColor: "#0047A1",
        tabBarInactiveTintColor: "#7C7C7C",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="LeaderBoard"
        component={LeaderBoardStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default TabStack;

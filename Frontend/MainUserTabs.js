// MainUserTabs.js
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';


const Tab = createMaterialTopTabNavigator();

const RankScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Rank Details Here</Text>
  </View>
);

const MyActivityScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>My Activity Details Here</Text>
  </View>
);

const MainUserTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Rank" component={RankScreen} />
    <Tab.Screen name="My Activity" component={MyActivityScreen} />
  </Tab.Navigator>
);

export default MainUserTabs;

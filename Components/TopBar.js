import React, { useState } from "react";
import {
  View,
  TextInput,
  Dimensions,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function Main(){
  return(
    <View>
      <Text>
Hi
      </Text>

    </View>
  )
}

function Rank() {
  return (
    <View style={styles.container}>
    <Main/>
    </View>
  );
}

function MyActivity() {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
    </View>
  );
}

export default function TabsNavigator() {
  return (
<>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12 },
          tabBarIndicatorStyle: { backgroundColor: "black" },
          tabBarStyle: { backgroundColor: "white" },
        }}
      >
        <Tab.Screen name="Rank" component={Rank} />
        <Tab.Screen name="MyActivity" component={MyActivity} />
      </Tab.Navigator>
</>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

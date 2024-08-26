import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import AndroidStep from "./Android";
import Ios from "./Ios";

const Home = () => {
  const [step, setStep] = useState(false);
  if (Platform.OS === "ios") {
    return <Ios />;
  } else {
    return <>{step ? <Ios /> : <AndroidStep />}</>;
  }
};
export default Home;

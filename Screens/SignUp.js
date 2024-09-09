import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const App = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      const requestBody = {
        first_name: firstname,
        last_name: lastname,
        email: email,
        password: password,
      };

      console.log("Request body:", requestBody);

      const response = await fetch(
        "https://ngage.nexalink.co/health/users/signup", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); 
        console.log("Server Error:", errorData);
        throw new Error(`Server error: ${response.status} - ${errorData.message || 'Invalid request'}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

  
      handleOtpGet();

    } catch (error) {
      console.error("Error during signup:", error);
      Alert.alert("Error", "An error occurred during signup. Please try again.");
    }
  };

  const handleOtpGet = async () => {
    try {
      const response = await fetch(
        `https://ngage.nexalink.co/health/loginotp?email=${email}`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
  
      if (!response.ok) {
        const errorData = await response.json(); 
        console.log("Error sending OTP:", errorData);
        throw new Error(`Error sending OTP: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("OTP sent:", data);
  

      Alert.alert("Success", "OTP has been sent to your email.");
      setIsOtpSent(true); 
    } catch (error) {
      console.error("Error during OTP GET request:", error);
      Alert.alert("Error", "An error occurred while sending OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        "https://ngage.nexalink.co/health/loginotp", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, otp: otp }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); 
        console.log("Error during OTP verification:", errorData);
        throw new Error(errorData.message || "OTP verification failed");
      }

      const data = await response.json();
      console.log("OTP verification successful:", data);


      Alert.alert("Success", "OTP verified successfully!");
      navigation.replace("Login"); 

    } catch (error) {
      console.error("Error during OTP verification:", error);
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      {!isOtpSent ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstname}
            onChangeText={(text) => setFirstname(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastname}
            onChangeText={(text) => setLastname(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up & Get OTP</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.header}>Enter OTP</Text>
          <View style={styles.otpContainer}>
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={(text) => setOtp(text)}
              placeholder="Enter OTP"
              keyboardType="numeric"
              placeholderTextColor={"#000"}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#405D72',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#405D72',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#405D72',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  otpInput: {
    width: "90%",
    height: 50,
    borderWidth: 1,
    borderColor: '#405D72',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,

  },
});

export default App;

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("team@email.com");
  const [password, setPassword] = useState("12345");

  // 🔹 Function to Handle Login
  const handleLogin = async () => {
    try {
      // const response = await axios.post("http://10.0.2.2:5000/login", {
      //   email,
      //   password,
      // });
      const response = {
        email : 'team@email.com',
        password : '12345',
      };

      setTimeout(() => {
        Alert.alert("Login Success", "Welcome to Wellness App");
        navigation.navigate("Home");
      }, 2000); // 1000ms = 1 second
      //Alert.alert(" Login Success", "Welcome to Wellness App");
      //console.log("Login Successful:", response.data);
      //navigation.navigate("Home");
    } catch (error) {
      console.error("Login Error:", error.response ? error.response.data : error);
      Alert.alert("Login Failed", error.response?.data?.message || "Server error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address" 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "85%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  button: {
    width: "85%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#007bff",
    marginTop: 15,
  },
});

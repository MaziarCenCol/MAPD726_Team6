import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "./styles"; 
import LoginScreen from "./Home/LoginScreen";
import SignUpScreen from "./Home/SignUpScreen";
import MoodScreen from "./MoodScreen"; 
import MoodDetailsScreen from "./MoodDetailsScreen";
import MoodHistoryScreen from "./MoodHistoryScreen";
import HistoryGraphScreen from "./HistoryGraphScreen";


const Stack = createStackNavigator();

const moods = [
  { id: 1, icon: "frown", label: "Poor" },
  { id: 2, icon: "meh", label: "Not Good" },
  { id: 3, icon: "meh-blank", label: "Neutral" },
  { id: 4, icon: "smile", label: "Good" },
  { id: 5, icon: "grin", label: "Amazing" },
];

// Home Screen Component
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={[styles.bigBox, { alignSelf: "center" }]}>
        <Text style={styles.title}>How are you today?</Text>
        <Text style={styles.subtitle}>Choose your main feeling.</Text>

        {/* Mood Selection Box */}
        <View style={styles.moodBox}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={styles.moodItem}
              onPress={() => navigation.navigate("MoodScreen", { mood })}
            >
              <FontAwesome5 name={mood.icon} size={28} color="#gray" />
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.buttonContainer, { marginTop: 150 }]}>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("MoodHistoryScreen")}
          >
            <Text style={styles.buttonText}>View Mood History {">"}</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.buttonContainer,
            { marginTop: 50, width: "100%", marginLeft: 30 },
          ]}
        >
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Navigation Setup
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ title: "Sign Up" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MoodScreen" component={MoodScreen} options={{ title: "Your Mood" }} />
        <Stack.Screen name="MoodDetailsScreen" component={MoodDetailsScreen} options={{ title: "Your Mood" }} />
        <Stack.Screen name="MoodHistoryScreen" component={MoodHistoryScreen} options={{ title: "Mood History" }} />
        <Stack.Screen name="HistoryGraphScreen" component={HistoryGraphScreen} options={{ title: "Mood Report" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

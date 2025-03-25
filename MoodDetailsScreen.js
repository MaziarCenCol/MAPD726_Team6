import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function MoodDetailsScreen({ route }) {
  const navigation = useNavigation();
  const { selectedMoods } = route.params;
  const [note, setNote] = useState("");
  const maxChars = 250;

  const currentDate = new Date().toLocaleDateString();

  return (
    <View style={styles.container}>
      <View style={styles.bigBox}>
        <Text style={styles.heading}>Selected Emotions:</Text>

        <View style={styles.moodContainer}>
          {selectedMoods.map((mood, index) => (
            <View key={index} style={styles.moodTag}>
              <Text style={styles.moodText}>{mood}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.title}>What could be the reason behind your mood today?</Text>
        <Text style={styles.subtitle}>Add a note about it!</Text>

        <Text style={styles.date}>{currentDate}</Text>

        <TextInput
          style={styles.textArea}
          placeholder="Type here..."
          multiline
          maxLength={maxChars}
          value={note}
          onChangeText={setNote}
        />

        <Text style={styles.charCounter}>{note.length}/{maxChars}</Text>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.navigate("HistoryGraphScreen")}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.navigate("HistoryGraphScreen")}>
          <Text style={styles.submitButtonText}>Skip</Text>
        </TouchableOpacity>
      
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9d9d9",
    justifyContent: "center",
    alignItems: "center",
  },
  bigBox: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 15,
  },
  moodTag: {
    backgroundColor: "#97ba8d",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    margin: 5,
  },
  moodText: {
    color: "white",
    fontSize: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  textArea: {
    width: "100%",
    height: 220,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: "white",
    textAlignVertical: "top",
  },
  charCounter: {
    fontSize: 12,
    color: "#666",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: "#d9d9d9",
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "black",
    fontSize: 16,
  },
});

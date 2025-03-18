import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function MoodScreen({ route, navigation }) {
  const { mood } = route.params;
  const [showMore, setShowMore] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState([]); // Track selected moods

  const initialMoods = [
    "Fantastic", "Excited", "Confident", "Motivated", "Optimistic",
    "Proud", "Relieved", "Surprised", "Grateful", "Reassured",
    "Inspired", "Relaxed"
  ];

  const moreMoods = [
    "Hopeful", "Contemplative", "Content", "Happy", "Satisfied", "Amazed"
  ];

  const allMoods = [...initialMoods, ...(showMore ? moreMoods : [])];

  // Toggle mood selection
  const toggleMoodSelection = (mood) => {
    setSelectedMoods(prevSelected =>
      prevSelected.includes(mood)
        ? prevSelected.filter(item => item !== mood) // Remove if already selected
        : [...prevSelected, mood] // Add if not selected
    );
  };

  return (
    <View style={styles.container}>
      <FontAwesome5 name={mood.icon} size={28} color="black" />
      <Text style={styles.title}>{mood.label}</Text>

      <View style={styles.bigBox}>
        <Text style={styles.heading}>
          Which emotions resonate with you right now?
        </Text>
        <Text style={styles.subheading}>
          Choose the reasons that reflect your emotions
        </Text>

        <View style={styles.moodGrid}>
          {allMoods.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.moodButton,
                selectedMoods.includes(item) && styles.moodButtonSelected, // Apply selected style
              ]}
              onPress={() => toggleMoodSelection(item)}
            >
              <Text
                style={[
                  styles.moodButtonText,
                  selectedMoods.includes(item) && styles.moodButtonTextSelected, // Apply selected text color
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {!showMore && (
          <TouchableOpacity onPress={() => setShowMore(true)}>
            <Text style={styles.seeMoreText}>See more</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() =>
            navigation.navigate("MoodDetailsScreen", { selectedMoods })
          }
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    width: "100%",
  },
  moodButton: {
    backgroundColor: "white",
    flexWrap: "nowrap",
    paddingVertical: 15,
    paddingHorizontal: 0,
    borderRadius: 15,
    marginVertical: 7,
    marginHorizontal: 1,
    width: "32%",
    alignItems: "center",
  },
  moodButtonSelected: {
    backgroundColor: "#97ba8d", // Green background for selected moods
  },
  moodButtonText: {
    color: "black",
    fontSize: 11,
  },
  moodButtonTextSelected: {
    color: "white", // Change text color for selected moods
  },
  seeMoreText: {
    color: "blue",
    fontSize: 14,
    marginVertical: 10,
  },
  continueButton: {
    backgroundColor: "#d9d9d9",
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  continueButtonText: {
    color: "black",
    fontSize: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    margin: 18,
  },
  subheading: {
    fontSize: 14,
    textAlign: "left",
    marginBottom: 15,
  },
});
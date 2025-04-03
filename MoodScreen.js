import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const moodsData = require("./moods.json");

export default function MoodScreen({ route, navigation }) {
  const { mood } = route.params;
  const [showMore, setShowMore] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [moodList, setMoodList] = useState([]);

  useEffect(() => {
    if (!mood || !mood.id) {
      console.error("Invalid mood parameter received:", mood);
      return;
    }

    let selectedCategory = [];
    if (mood.id === 4 || mood.id === 5) {
      selectedCategory = moodsData.positive_moods;
    } else if (mood.id === 1 || mood.id === 2) {
      selectedCategory = moodsData.negative_moods;
    } else {
      selectedCategory = moodsData.neutral_moods;
    }

    setMoodList(selectedCategory);
  }, [mood]);

  const toggleMoodSelection = (mood) => {
    setSelectedMoods((prevSelected) =>
      prevSelected.includes(mood)
        ? prevSelected.filter((item) => item !== mood)
        : [...prevSelected, mood]
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <FontAwesome5 name={mood.icon} size={28} color="black" />
        <Text style={styles.title}>{mood.label}</Text>

        <View style={styles.bigBox}>
          <Text style={styles.heading}>Which emotions resonate with you right now?</Text>
          <Text style={styles.subheading}>Choose the reasons that reflect your emotions</Text>

          <View style={styles.moodGrid}>
            {(showMore ? moodList : moodList.slice(0, 12)).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.moodButton, selectedMoods.includes(item.title) && styles.moodButtonSelected]}
                onPress={() => toggleMoodSelection(item.title)}
              >
                <Text style={styles.moodButtonText}>{item.emoji}{"\n"}{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {moodList.length > 12 && (
            <TouchableOpacity onPress={() => setShowMore(!showMore)}>
              <Text style={styles.moreText}>{showMore ? "Show Less" : "More..."}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate("MoodDetailsScreen", { selectedMoods })}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9d9d9",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 20,
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
    paddingVertical: 9,
    borderRadius: 15,
    marginVertical: 7,
    width: "32%",
    alignItems: "center",
  },
  moodButtonSelected: {
    backgroundColor: "#97ba8d",
  },
  moodButtonText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
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
  moreText: {
    fontSize: 16,
    color: "#007BFF",
    marginTop: 10,
  },
});

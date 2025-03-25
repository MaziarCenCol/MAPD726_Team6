//
// this screen merged into the HistoryGraphScreen.js after updating the figma mockup
//
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import moodHistoryData from "./mood_history.json";
import { parseISO, format } from "date-fns";

const moods = [
  { id: 1, icon: "frown", label: "Poor" },
  { id: 2, icon: "meh", label: "Not Good" },
  { id: 3, icon: "meh-blank", label: "Neutral" },
  { id: 4, icon: "smile", label: "Good" },
  { id: 5, icon: "grin", label: "Amazing" },
];

const getMoodIcon = (id) => {
  const mood = moods.find((m) => m.id === id);
  return mood ? mood.icon : "question-circle";
};

export default function MoodHistoryScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [moodData, setMoodData] = useState([]);
  const [dataDates, setDataDates] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().split("T")[0].slice(0, 7)
  );

  useEffect(() => {
    const dates = moodHistoryData[0]?.history.map((item) => item.date);
    const uniqueDates = [...new Set(dates)];
    setDataDates(uniqueDates);

    if (uniqueDates.length > 0) {
      setSelectedDate(uniqueDates[0]);
    }
  }, []);

  useEffect(() => {
    const filteredData = moodHistoryData[0]?.history.filter((item) =>
      item.date.startsWith(selectedMonth)
    );
    setMoodData(filteredData);
  }, [selectedMonth]);

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    setSelectedDate(selectedDate);

    const filteredData = moodHistoryData[0]?.history.filter(
      (item) => item.date === selectedDate
    );
    setMoodData(filteredData);
  };

  const resetFilter = () => {
    setSelectedDate(null);
    setMoodData(moodHistoryData[0]?.history);
  };

  const renderItem = ({ item }) => (
    <View style={styles.entryContainer}>
      <Text style={styles.dateText}>
        {format(parseISO(item.date), "EEEE, MMM dd, yyyy")}
      </Text>
      <View style={styles.moodBox}>
        <FontAwesome5 name={getMoodIcon(item.mood_id)} size={28} color="gray" />
        <View style={styles.moodDetails}>
          {item.initialMoods.map((mood, index) => (
            <View key={index} style={styles.moodTag}>
              <Text style={styles.moodText}>{mood}</Text>
            </View>
          ))}
          <View style={styles.detailTag}>
            <Text style={styles.detailText}>{item.detail}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Button to Navigate to Graph Screen */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate("HistoryGraphScreen")}
      >
        <Text style={styles.buttonText}>View Mood Graph</Text>
      </TouchableOpacity>

      {/* Calendar View */}
      <Calendar
        current={new Date().toISOString().split("T")[0]}
        onDayPress={handleDayPress}
        onMonthChange={(month) =>
          setSelectedMonth(month.dateString.slice(0, 7))
        }
        markedDates={Object.fromEntries(
          dataDates.map((date) => [
            date,
            {
              selected: true,
              selectedColor: "orange",
              selectedTextColor: "white",
            },
          ])
        )}
        theme={{ textDayFontSize: 14, textMonthFontSize: 20 }}
      />

      {/* Mood Entries Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Mood Entries</Text>
        <TouchableOpacity onPress={resetFilter} style={styles.allButton}>
          <Text style={styles.allButtonText}>All</Text>
        </TouchableOpacity>
      </View>

      {/* Mood Entries List */}
      <FlatList
        data={moodData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text>No entries for selected date</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  historyButton: { padding: 10, backgroundColor: "#007BFF", borderRadius: 5, marginBottom: 10 },
  buttonText: { color: "#FFF", textAlign: "center", fontSize: 16 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  allButton: {
    backgroundColor: "#ff9800",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  allButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  entryContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#d9d9d9",
    borderRadius: 15,
    width: "100%",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  moodBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  moodDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 10,
    alignItems: "center",
  },
  moodTag: {
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 5,
  },
  moodText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  detailTag: {
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 5,
    width: "90%",
  },
  detailText: {
    fontSize: 12,
    color: "gray",
  },
});

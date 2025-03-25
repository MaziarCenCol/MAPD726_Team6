import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, Dimensions, BackHandler} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import moodsJson from "./moods.json";
import { FontAwesome5 } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { parseISO, format } from "date-fns";
import moodHistoryData from "./mood_history.json";
import SQLite from "react-native-sqlite-storage";

const screenWidth = Dimensions.get("window").width;

// Open the SQLite database
// const db = SQLite.openDatabase(
//   { name: "moodTracker.db", location: "default" }, // For Android
//   () => console.log("Database opened"),
//   (error) => console.log("Database error: ", error)
// );


const moodColors = {
  1: "red",
  2: "orange",
  3: "yellow",
  4: "blue",
  5: "green",
};

const moodEmojis = {
  1: "😊", // Happy
  2: "🙏", // Hopeful
  3: "😢", // Sad
  4: "😡", // Angry
  5: "😐", // Neutral
};

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

const getWeekRange = (startDate) => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
};

const filterHistoryByWeek = (history, startDate) => {
  const { start, end } = getWeekRange(startDate);
  return history.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= start && entryDate <= end;
  });
};

const filterDataByTime = (data, filter) => {
  return data.filter((entry) => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    if (filter === "Week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return entryDate >= oneWeekAgo;
    } else if (filter === "Month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return entryDate >= oneMonthAgo;
    } else {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      return entryDate >= oneYearAgo;
    }
  });
};

const getMoodData = (data, filter) => {
  const filteredData = {};
  data.forEach((entry) => {
    let key;
    if (filter === "Week")
      key = new Date(entry.date).toLocaleString("en-US", { weekday: "short" });
    else if (filter === "Month")
      key = new Date(entry.date).getDate().toString();
    else key = (new Date(entry.date).getMonth() + 1).toString();
    filteredData[key] = (filteredData[key] || 0) + 1;
  });

  return Object.keys(filteredData).map((key) => ({
    label: key,
    value: filteredData[key],
  }));
};

// Function to count Initial Moods occurrences
const getInitialMoodData = (data, filter) => {
  const filteredData = filterDataByTime(data, filter);
  const moodCounts = {};

  filteredData.forEach((entry) => {
    entry.initialMoods.forEach((mood) => {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
  });

  return Object.entries(moodCounts).map(([mood, count]) => ({ mood, count }));
};

const getEmoji = (mood) => {
  // Search in all three categories (positive, neutral, negative)
  for (const category of [
    "positive_moods",
    "neutral_moods",
    "negative_moods",
  ]) {
    const foundMood = moodsJson[category].find((item) => item.title === mood);
    if (foundMood) {
      return foundMood.emoji; // Return the found emoji
    }
  }
  return ""; // Return empty string if no emoji found
};

export default function HistoryGraphScreen() {
  const [selectedTab, setSelectedTab] = useState("insights");
  const [pieFilter, setPieFilter] = useState("Week");
  const [barFilter, setBarFilter] = useState("Week");
  const [initialMoodFilter, setInitialMoodFilter] = useState("Week");
  const [initialMoodData, setInitialMoodData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  // -------------- comes from History Screen ----------------
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
  // ========================================================

  const userHistory = moodHistoryData[0].history; // Assuming single user for now
  const [currentWeekStart, setCurrentWeekStart] = useState(
    new Date("2025-02-02")
  );
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    setInitialMoodData(
      getInitialMoodData(moodHistoryData[0]?.history || [], initialMoodFilter)
    );
  }, [initialMoodFilter]);

  useEffect(() => {
    const filteredData = filterDataByTime(
      moodHistoryData[0]?.history || [],
      pieFilter
    );
    const moodNames = {
      1: "Poor",
      2: "Not Good",
      3: "Neutral",
      4: "Good",
      5: "Amazing",
    };

    const moodCounts = {};
    filteredData.forEach((entry) => {
      moodCounts[entry.mood_id] = (moodCounts[entry.mood_id] || 0) + 1;
    });

    setPieData(
      Object.keys(moodCounts).map((key) => ({
        name: moodNames[key] || `Mood ${key}`,
        count: moodCounts[key],
        color: moodColors[key] || "#000",
        legendFontColor: "#333",
        legendFontSize: 12,
      }))
    );
  }, [pieFilter]);

  useEffect(() => {
    const filteredData = filterDataByTime(
      moodHistoryData[0]?.history || [],
      barFilter
    );
    setBarData(getMoodData(filteredData, barFilter));
  }, [barFilter]);

  //-------------------
  useEffect(() => {
    const filteredHistory = filterHistoryByWeek(userHistory, currentWeekStart);
    const weekStats = Array(7)
      .fill(0)
      .map(() => ({ count: 0, emoji: "❓" }));

    filteredHistory.forEach((entry) => {
      const dayIndex = new Date(entry.date).getDay();
      weekStats[dayIndex].count += 1;
      weekStats[dayIndex].emoji = moodEmojis[entry.mood_id] || "❓";
    });

    setWeeklyData(weekStats);
  }, [currentWeekStart]);

  const changeWeek = (direction) => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + direction * 7);
      return newDate;
    });
  };
  // ====================

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      {/* Top Navigation Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "insights" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("insights")}
        >
          <Text style={styles.tabText}>Insights</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "stats" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("stats")}
        >
          <Text style={styles.tabText}>Stats</Text>
        </TouchableOpacity>
      </View>

      {/* Conditionally Render Views */}
      <FlatList
        data={[selectedTab === "insights" ? "insights" : "statistics"]} // Use a dummy data for conditional rendering
        renderItem={() => (
          <>
            {selectedTab === "insights" ? (
              <>
                {/* Pie Chart Section */}
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Mood Distribution</Text>
                  <PieChart
                    data={pieData}
                    width={screenWidth - 40}
                    height={200}
                    chartConfig={{ color: () => "#000" }}
                    accessor={"count"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    absolute
                  />
                  <View style={styles.buttonRow}>
                    {["Week", "Month", "Year"].map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setPieFilter(option)}
                        style={[
                          styles.filterButton,
                          pieFilter === option && styles.activeFilter,
                        ]}
                      >
                        <Text>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Bar Chart Section */}
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Number of Entries</Text>
                  <BarChart
                    data={{
                      labels: barData?.map((d) => d.label) || [],
                      datasets: [{ data: barData?.map((d) => d.value) || [] }],
                    }}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={{
                      backgroundGradientFrom: "#f5f5f5",
                      backgroundGradientTo: "#f5f5f5",
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      barPercentage: 0.6,
                    }}
                    fromZero
                    showValuesOnTopOfBars
                  />
                  <View style={styles.buttonRow}>
                    {["Week", "Month", "Year"].map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setBarFilter(option)}
                        style={[
                          styles.filterButton,
                          barFilter === option && styles.activeFilter,
                        ]}
                      >
                        <Text>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Initial Moods Section */}
                <View
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: 15,
                    borderRadius: 15,
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      textAlign: "center",
                      marginBottom: 10,
                    }}
                  >
                    Frequently recorded
                  </Text>

                  {/* Display Initial Moods List */}
                  {initialMoodData.length > 0 ? (
                    initialMoodData.map(({ mood, count }) => {
                      const emoji = getEmoji(mood); // Get the corresponding emoji for each mood
                      return (
                        <Text
                          key={mood}
                          style={{
                            fontSize: 14,
                            textAlign: "left",
                            marginBottom: 5,
                            marginLeft: 20,
                          }}
                        >
                          {emoji} {mood} ({count})
                        </Text>
                      );
                    })
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        textAlign: "center",
                        color: "gray",
                      }}
                    >
                      No Data
                    </Text>
                  )}

                  {/* Filter Buttons */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    {["Week", "Month", "Year"].map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setInitialMoodFilter(option)}
                        style={{
                          flex: 1,
                          padding: 4,
                          backgroundColor:
                            initialMoodFilter === option ? "gray" : "white",
                          alignItems: "center",
                          borderRadius: 15,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* Statistics */}
                <View>
                  <View style={styles.statsContainer}>
                    {/* Week Navigator */}
                    <View style={styles.weekNavigator}>
                      <TouchableOpacity onPress={() => changeWeek(-1)}>
                        <Text style={styles.navButton}>{"⬅️"}</Text>
                      </TouchableOpacity>
                      <Text style={styles.weekText}>
                        {currentWeekStart.toDateString()}
                      </Text>
                      <TouchableOpacity onPress={() => changeWeek(1)}>
                        <Text style={styles.navButton}>{"➡️"}</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Emoji Labels */}
                    <FlatList
                      horizontal
                      data={weeklyData}
                      keyExtractor={(_, index) => index.toString()}
                      contentContainerStyle={styles.emojiContainer}
                      renderItem={({ item, index }) => (
                        <View style={styles.emojiWrapper}>
                          <Text style={styles.emoji}>{item.emoji}</Text>
                        </View>
                      )}
                    />

                    {/* Bar Chart */}
                    <BarChart
                      data={{
                        labels: [
                          "Sun",
                          "Mon",
                          "Tue",
                          "Wed",
                          "Thu",
                          "Fri",
                          "Sat",
                        ],
                        datasets: [
                          { data: weeklyData.map((day) => day.count) },
                        ],
                      }}
                      width={screenWidth - 50}
                      height={220}
                      yAxisLabel=""
                      chartConfig={{
                        backgroundColor: "#f4f4f4",
                        backgroundGradientFrom: "#f4f4f4",
                        backgroundGradientTo: "#f4f4f4",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                        labelColor: (opacity = 1) =>
                          `rgba(0, 0, 0, ${opacity})`,
                        style: { borderRadius: 16 },
                      }}
                      style={{ marginVertical: 0, borderRadius: 16 }}
                    />
                  </View>

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
                    <TouchableOpacity
                      onPress={resetFilter}
                      style={styles.allButton}
                    >
                      <Text style={styles.allButtonText}>All</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Mood Entries List */}
                  <FlatList
                    data={moodData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={
                      <Text>No entries for selected date</Text>
                    }
                  />
                </View>
              </>
            )}
          </>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}

const styles = {
  tabButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    flex: 1,
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#4CAF50" },
  tabText: { color: "#fff", fontWeight: "bold" },
  chartContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  buttonRow: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  filterButton: {
    flex: 1,
    padding: 4,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 15,
  },

  activeFilter: { backgroundColor: "gray" },

  statsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -50,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },

  statsText: { fontSize: 18, fontWeight: "bold", color: "#666" },

  container: {
    padding: 20,
    alignItems: "center",
  },
  weekNavigator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingLeft: 50,
  },
  navButton: {
    fontSize: 24,
    paddingHorizontal: 20,
  },
  weekText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  emojiContainer: {
    width: "100%",
    paddingLeft: 125,
  },
  emojiWrapper: {
    marginRight: 25, // adjust this value to control the space between emojis
  },
  emoji: {
    fontSize: 18,
    textAlign: "center", // 'center' will align the emoji nicely in the wrapper
  },

  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  historyButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    marginBottom: 10,
  },
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
};

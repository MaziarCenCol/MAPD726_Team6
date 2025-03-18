import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import moodHistoryData from "./mood_history.json";

const screenWidth = Dimensions.get("window").width;

const moodColors = {
  1: "red",
  2: "orange",
  3: "yellow",
  4: "blue",
  5: "green",
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

export default function HistoryGraphScreen() {
  const [selectedTab, setSelectedTab] = useState("insights");
  const [pieFilter, setPieFilter] = useState("Week");
  const [barFilter, setBarFilter] = useState("Week");
  const [initialMoodFilter, setInitialMoodFilter] = useState("Week");
  const [initialMoodData, setInitialMoodData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

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
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
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
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Frequently recorded
              </Text>

              {/* Display Initial Moods List */}
              {initialMoodData.length > 0 ? (
                initialMoodData.map(({ mood, count }) => (
                  <Text
                    key={mood}
                    style={{
                      fontSize: 14,
                      textAlign: "left",
                      marginBottom: 5,
                      marginLeft: 20,
                    }}
                  >
                    {mood} ({count})
                  </Text>
                ))
              ) : (
                <Text
                  style={{ fontSize: 16, textAlign: "center", color: "gray" }}
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
          // -------------- Statistics -----------------

          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Statistics will be displayed here...
            </Text>
          </View>
        )}
      </ScrollView>
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
  statsContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  statsText: { fontSize: 18, fontWeight: "bold", color: "#666" },
};

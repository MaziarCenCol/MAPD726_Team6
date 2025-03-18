import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },

  moodBox: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow wrapping
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center", // Center items when wrapping
    width: "100%",
    gap: 10, // Add spacing between icons
  },
  
  moodItem: {
    alignItems: "center",
    padding: 5,
    borderRadius: 8,
    paddingTop: 30,
    paddingBottom: 50,
    margin: 0
  },
  selectedMood: {
    backgroundColor: "#444",
  },
  moodLabel: {
    fontSize: 12,
    marginTop: 5,
    color: "black",
  },
  historyButton: {
    backgroundColor: "#d9d9d9",
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: "#d9d9d9",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 18,
  },
});


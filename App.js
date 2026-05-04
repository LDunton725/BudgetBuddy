/* 
Mobile Application Development Final Project
Name: Larnice Dunton
Professor: Morgan Smith

App Summary:
Budget Buddy allows users to select a month, create a budget,
add bills, and view a summary. The app also detects screen rotation.

File: App.js
Purpose: Main file that controls all screens and app behavior.
*/

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// months
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// MAIN APP
export default function App() {

  const [screen, setScreen] = useState("home");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [orientation, setOrientation] = useState("portrait");

  const [budgets, setBudgets] = useState({});

  const [income, setIncome] = useState("");
  const [billName, setBillName] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [bills, setBills] = useState([]);

  // add bill
  const addBill = () => {
    if (billName === "" || billAmount === "") return;

    const newBill = {
      name: billName,
      amount: parseFloat(billAmount)
    };

    setBills([...bills, newBill]);
    setBillName("");
    setBillAmount("");
  };

  // save budget
  const saveBudget = async () => {
    const updated = {
      ...budgets,
      [selectedMonth]: { income, bills }
    };

    setBudgets(updated);
    await AsyncStorage.setItem("budgets", JSON.stringify(updated));
  };

  // clear budget
  const clearBudget = () => {
    Alert.alert(
      "Clear Budget",
      "Are you sure you want to delete this budget?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            setIncome("");
            setBills([]);

            const updated = { ...budgets };
            delete updated[selectedMonth];

            setBudgets(updated);
            await AsyncStorage.setItem("budgets", JSON.stringify(updated));
          }
        }
      ]
    );
  };

  // load saved data
  useEffect(() => {
    const loadData = async () => {
      const stored = await AsyncStorage.getItem("budgets");
      if (stored) {
        setBudgets(JSON.parse(stored));
      }
    };
    loadData();
  }, []);

  // load data when month changes
  useEffect(() => {
    const data = budgets[selectedMonth];

    if (data) {
      setIncome(data.income);
      setBills(data.bills);
    } else {
      setIncome("");
      setBills([]);
    }
  }, [selectedMonth, budgets]);

  // detect orientation
  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get("window");
      setOrientation(width > height ? "landscape" : "portrait");
    };

    updateOrientation();

    const sub = Dimensions.addEventListener("change", updateOrientation);
    return () => sub?.remove();
  }, []);

  // calculations
  const totalBills = bills.reduce((sum, item) => sum + item.amount, 0);
  const remainingValue = parseFloat(income || 0) - totalBills;
  const remaining = remainingValue.toFixed(2);

  // Screen 1
  if (screen === "home") {
    return (
      <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.gradient}>
        <View style={styles.homeContainer}>

          <Text style={styles.title}>Budget Buddy</Text>
          <Text style={styles.label}>Select Month</Text>

          <View style={styles.card}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            >
              {months.map((m) => (
                <Picker.Item key={m} label={m} value={m} />
              ))}
            </Picker>
          </View>

          <View style={styles.buttonArea}>
            <TouchableOpacity style={styles.customButton} onPress={() => setScreen("create")}>
              <Text style={styles.buttonTextWhite}>Create Budget</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.customButton} onPress={() => setScreen("view")}>
              <Text style={styles.buttonTextWhite}>View Budget</Text>
            </TouchableOpacity>
          </View>

        </View>
      </LinearGradient>
    );
  }

  // Screen 2
  if (screen === "create") {
    return (
      <LinearGradient colors={["#00c9a7", "#4facfe"]} style={styles.gradient}>

        <View style={styles.container}>

          <Text style={styles.title}>Create Budget</Text>
          <Text style={styles.monthText}>Month: {selectedMonth}</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Income"
            keyboardType="numeric"
            value={income}
            onChangeText={setIncome}
          />

          <TextInput
            style={styles.input}
            placeholder="Bill Name"
            value={billName}
            onChangeText={setBillName}
          />

          <TextInput
            style={styles.input}
            placeholder="Bill Amount"
            keyboardType="numeric"
            value={billAmount}
            onChangeText={setBillAmount}
          />

          <TouchableOpacity style={styles.smallButton} onPress={addBill}>
            <Text style={styles.buttonTextWhite}>Add Bill</Text>
          </TouchableOpacity>

          {/* BILL LIST */}
          <View style={{ width: "100%", maxHeight: 150, alignItems: "center" }}>
            <FlatList
              data={bills}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.listItem}>
                  {item.name}: ${item.amount}
                </Text>
              )}
            />
          </View>

          {/* BUTTONS */}
          <View style={{ width: "100%", alignItems: "center", marginTop: 10 }}>

            <TouchableOpacity style={styles.customButton} onPress={saveBudget}>
              <Text style={styles.buttonTextWhite}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.customButton} onPress={clearBudget}>
              <Text style={styles.buttonTextWhite}>Clear Budget</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.customButton} onPress={() => setScreen("view")}>
              <Text style={styles.buttonTextWhite}>Calculate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.customButton} onPress={() => setScreen("home")}>
              <Text style={styles.buttonTextWhite}>Back</Text>
            </TouchableOpacity>

          </View>

        </View>

      </LinearGradient>
    );
  }

  // Screen 3
  if (screen === "view") {
    return (
      <LinearGradient colors={["#5ea5e8", "#f18af7"]} style={styles.gradient}>
        <View style={styles.container}>

          <Text style={styles.title}>Summary</Text>
          <Text style={styles.monthText}>Month: {selectedMonth}</Text>

          <Text style={styles.label}>Income:</Text>
          <Text style={styles.incomeText}>${income || "0.00"}</Text>

          <Text style={styles.sectionLabel}>Bills:</Text>

          {bills.length === 0 ? (
            <Text style={styles.listItem}>No bills added</Text>
          ) : (
            bills.map((item, index) => (
              <Text key={index} style={styles.expenseText}>
                {item.name}: ${item.amount}
              </Text>
            ))
          )}

          <Text style={styles.expenseText}>Total Bills: ${totalBills}</Text>

          <Text style={styles.label}>Remaining:</Text>
          <Text style={remainingValue < 0 ? styles.expenseText : styles.incomeText}>
            ${remaining}
          </Text>

          <TouchableOpacity style={styles.customButton} onPress={() => setScreen("home")}>
            <Text style={styles.buttonTextWhite}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.customButton} onPress={() => setScreen("create")}>
            <Text style={styles.buttonTextWhite}>Add Bills</Text>
          </TouchableOpacity>

        </View>
      </LinearGradient>
    );
  }
}

// styles
const styles = StyleSheet.create({

  gradient: { flex: 1 },

  homeContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 90
  },

  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,
    justifyContent: "flex-start",
    width: "100%"
  },

  landscape: {
    flexDirection: "column", // prevents squishing
    alignItems: "center",
    width: "100%"
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#ffffff",
    textAlign: "center"
  },

  label: {
    fontSize: 20,
    marginTop: 12,
    color: "#ffffff",
    fontWeight: "bold"
  },

  monthText: {
    fontSize: 20,
    color: "#ffffff",
    marginBottom: 25
  },

  sectionLabel: {
    fontSize: 20,
    color: "#ffffff",
    marginTop: 20,
    fontWeight: "bold"
  },

  customButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 12,
    width: "65%",
    alignItems: "center"
  },

  smallButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
    width: "50%",
    alignItems: "center"
  },

  buttonTextWhite: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16
  },

  card: {
    width: "70%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 25
  },

  input: {
    width: "70%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 16
  },

  buttonArea: {
    width: "90%",
    alignItems: "center",
    marginTop: 25
  },

  listItem: {
    color: "#ffffff",
    marginTop: 6,
    fontSize: 16
  },

  incomeText: {
    color: "#00ff88",
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 18
  },

  expenseText: {
    color: "#ff4d4d",
    fontWeight: "bold",
    fontSize: 18
  }

});
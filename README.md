# Budget Buddy App

## Mobile Application Development Final Project

Name:Larnice Dunton  
Professor:Morgan Smith  

---

## App Description

Budget Buddy is a mobile budgeting application built using React Native and Expo. The app allows users to select a month, create a budget, add income and expenses, and view a financial summary.

The main purpose of this application is to help users practice basic budgeting by tracking monthly income, bills, total expenses, and remaining balance in an organized mobile interface.

---

## Features

- Select a month (January through December)
- Create and manage a monthly budget
- Add income and bill entries
- View a budget summary including:
  - Income
  - List of bills
  - Total expenses
  - Remaining balance
- Screen navigation between Home, Create Budget, and Summary screens
- Screen orientation detection (portrait and landscape support)

---

## Tools and Technologies Used

- React Native
- Expo
- JavaScript
- React Hooks (useState, useEffect)
- React Native Picker
- FlatList (for displaying bills)
- Expo Linear Gradient (for background styling)
- Dimensions API (for screen orientation detection)
- AsyncStorage (intended for persistent storage of monthly budgets across app sessions; currently being implemented)

---

## How the App Works

1. The user opens the app and lands on the Home screen.
2. The user selects a month and chooses either Create Budget or View Budget.
3. In the Create Budget screen, the user enters income and adds bills.
4. The app calculates total expenses and remaining balance.
5. The user navigates to the Summary screen to view results.
6. Budget data is currently stored in app state and is reset when the app refreshes.
7. AsyncStorage is intended to store monthly budgets permanently across sessions.

---

## Notes

- Each session currently stores data temporarily in memory.
- Full persistent storage using AsyncStorage is planned/being implemented.
- Future updates will allow each month to save and load independently.

---
# Rock-Paper-Scissors AI Mobile App

A React Native mobile application that uses the device camera to recognize hand gestures for playing Rock-Paper-Scissors against an AI opponent.

## Features

- 📱 Real-time camera gesture recognition
- 🎮 Play against AI with random moves
- 🎯 Simple and intuitive user interface
- 📊 Game results with detailed breakdown
- 🔄 Play multiple rounds

## Tech Stack

- **Frontend**: React Native with Expo
- **Camera**: Expo Camera API
- **Gesture Recognition**: Custom heuristic-based detection (simulated MediaPipe integration)
- **State Management**: React Hooks

## Setup Instructions

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- Android/iOS device or emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rps-ai-app
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

## Approach & Gesture Detection

This app uses Expo Camera for real-time camera preview. Due to Expo SDK 54 limitations, native gesture detection libraries (TensorFlow.js, MediaPipe) are not supported out-of-the-box. For demo and take-home challenge purposes, gesture selection is simulated via UI buttons, allowing you to play and test the game logic and user experience.

- **Gesture Detection (Demo):** User selects their gesture (Rock, Paper, Scissors) via on-screen buttons during the game round.
- **Game Logic:** The app randomly selects the AI's move and displays the result (Win/Lose/Draw).

## Running the App

Follow the setup instructions above. Use `npm start` or `yarn start` to run the app in Expo Go or a simulator.

- Scan the QR code with Expo Go app (Android/iOS)
- Press 'a' for Android emulator
- Press 'i' for iOS simulator

## Contribution & License

Feel free to fork, modify, and submit pull requests. Licensed under MIT.

## Notes
- For a real gesture detection experience, use a bare React Native app and integrate MediaPipe or TensorFlow.js.
- This demo is designed for easy review and testing in Expo environments.
- If you have questions, open an issue or contact the repo owner.
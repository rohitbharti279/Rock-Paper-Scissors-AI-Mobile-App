
# Rock–Paper–Scissors AI Mobile App (Take-Home Challenge)

This is a full-stack mobile app built with React Native (Expo) and a Python/Node.js backend, allowing users to play Rock–Paper–Scissors using real-time hand gesture recognition via their mobile camera.

## Challenge Brief

**Goal:** Demonstrate practical product thinking, full-stack capability, and real-time camera interaction in a clean, user-friendly mobile experience.

**Features:**
- 📱 Real-time camera gesture recognition (rock, paper, scissors)
- 🎮 Play against AI with random moves
- 🤖 Backend gesture detection using Python (MediaPipe) and Node.js (Express)
- 📊 Game results with detailed breakdown
- 🔄 Play multiple rounds
- 🧑‍💻 Clean, intuitive UI

## Tech Stack

- **Frontend:** React Native (Expo)
- **Camera:** Expo Camera API
- **Gesture Recognition:** Python backend using MediaPipe (via Express server)
- **Backend:** Node.js (Express) for API, Python for gesture detection
- **State Management:** React Hooks

## File Structure & Responsibilities

- `App.js`: Main app entry, handles navigation between game and result screens.
- `components/GameScreen.js`: Camera UI, handles photo capture, backend communication, loading spinner, and gesture/result display.
- `components/ResultScreen.js`: Displays round result, gestures, and play-again button.
- `utils/gameLogic.js`: Game logic, gesture/result mapping, emoji helpers.
- `backend/server.js`: Express server, handles image upload, calls Python script, returns gesture.
- `backend/controllMediapipe_detect.py`: Python script for gesture detection using MediaPipe.

## Approach & Gesture Detection

- The app uses the device camera to capture a photo when the user starts a round.
- The photo is sent to a backend server (`backend/server.js`), which calls a Python script (`controllMediapipe_detect.py`) using MediaPipe to detect the hand gesture.
- The backend returns the detected gesture (`rock`, `paper`, `scissors`, or `unknown`).
- The app randomly selects the AI's move and displays the result (Win/Lose/Draw).
- The UI shows a spinner while waiting for backend detection and displays clear feedback and instructions.

**Gesture Detection Details:**
- MediaPipe is used to extract hand landmarks from the image.
- A custom heuristic analyzes finger distances to classify gestures.
- Thresholds are tuned for reliable detection of rock, paper, and scissors.
- Backend robustly handles errors and cleans up resources.


## Install & Test

You can test the app via Expo Go using this link:
**https://expo.dev/accounts/rohit279/projects/rps-ai-app/updates/0e66747a-52d0-4746-bac3-4e42ffe445a7**

Scan the QR code in Expo Go or open the link on your device to run the app instantly.

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Python 3 (for backend)
- Android/iOS device or emulator

### Installation & Running
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
3. **Start the backend server**
   ```bash
   cd backend
   npm install
   # Start server (ensure Python 3 and required packages are installed)
   node server.js
   ```
   - Python dependencies: `pip install mediapipe opencv-python numpy`
4. **Start the mobile app**
   ```bash
   cd ..
   npm start
   # or
   yarn start
   ```
   - Scan the QR code with Expo Go app (Android/iOS)
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator

## Usage

1. Open the app and grant camera permissions.
2. Press "Start Game" and show a hand gesture (rock, paper, or scissors) in front of the camera.
3. The app captures your gesture, sends it to the backend, and instantly plays a round against the AI.
4. The result (Win/Lose/Draw) is displayed, with options to play again.

## Notes
- For best results, use good lighting and show your hand clearly to the camera.
- If you encounter network errors, ensure the backend server is running and accessible from your device.
- Gesture detection is based on MediaPipe hand landmarks and custom heuristics; thresholds can be tuned in `controllMediapipe_detect.py`.
- The backend is optional; you can adapt the app to use other gesture detection libraries or services.

## Deliverables
- Working mobile app (Expo project)
- Backend server (Node.js + Python)
- Clear README with setup and usage instructions
- Short note on approach and gesture detection

---

**Contact:** For questions, open an issue or contact the repo owner.

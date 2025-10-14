import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Camera } from 'expo-camera';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [screen, setScreen] = useState('game'); // 'game' or 'result'
  const [gameResult, setGameResult] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleGameResult = (result) => {
    setGameResult(result);
    setScreen('result');
  };

  const handlePlayAgain = () => {
    setScreen('game');
    setGameResult(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera</Text>
        <Text style={styles.subText}>Please enable camera permissions in your settings</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>🎮 RPS AI</Text>
        <Text style={styles.subtitle}>Play with Camera Gestures</Text>
      </View>

      {screen === 'game' && (
        <GameScreen onGameResult={handleGameResult} />
      )}

      {screen === 'result' && gameResult && (
        <ResultScreen 
          result={gameResult} 
          onPlayAgain={handlePlayAgain} 
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});
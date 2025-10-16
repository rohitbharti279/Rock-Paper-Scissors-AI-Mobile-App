import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { GESTURES, getAIMove, getGameResult, getGestureEmoji } from '../utils/gameLogic';

const { width } = Dimensions.get('window');

export default function GameScreen({ onGameResult }) {
  const [cameraRef, setCameraRef] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [currentGesture, setCurrentGesture] = useState(GESTURES.UNKNOWN);
  const [lastDetectedGesture, setLastDetectedGesture] = useState(GESTURES.UNKNOWN);
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [backendError, setBackendError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check backend status on component mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      console.log('Checking backend health...');
      const response = await fetch('https://rock-paper-scissors-ai-mobile-app-production.up.railway.app/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('Health check response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend status:', data);
        setIsBackendReady(true);
        setBackendError(null);
      } else {
        throw new Error(`Backend health check failed: ${response.status}`);
      }
    } catch (err) {
      console.error('❌ Backend health check error:', err);
      setIsBackendReady(false);
      setBackendError(err.message || 'Backend server is not reachable. Please make sure it is running.');
    }
  };

  // Start detection when game starts
  useEffect(() => {
    let interval;
    if (isDetecting && isBackendReady) {
      interval = setInterval(runDetection, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDetecting, isBackendReady]);

  // Send camera photo to backend for gesture detection
  const runDetection = async () => {
    if (!cameraRef) {
      setBackendError('Camera is not ready. Please check permissions and try again.');
      console.warn('No camera reference available');
      return;
    }
    setIsLoading(true);
    try {
      const photo = await cameraRef.takePictureAsync({
        base64: false,
        quality: 0.5,
      });
      if (!photo || !photo.uri) {
        setBackendError('Failed to capture photo. Please try again.');
        console.error('Photo object is undefined:', photo);
        setCurrentGesture(GESTURES.UNKNOWN);
        return;
      }
      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
      const backendUrl = 'https://rock-paper-scissors-ai-mobile-app-production.up.railway.app/detect';
      console.log('📸 Sending image to backend...');
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('📡 Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      const responseText = await response.text();
      console.log('📨 Raw response:', responseText);
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error('❌ JSON parse error:', jsonErr);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }
      console.log('✅ Parsed data:', data);
      if (data.gesture) {
        setCurrentGesture(data.gesture);
        if (data.gesture !== GESTURES.UNKNOWN) {
          setLastDetectedGesture(data.gesture);
        }
      } else {
        setCurrentGesture(GESTURES.UNKNOWN);
      }
      setBackendError(null);
    } catch (err) {
      console.error('❌ Detection error:', err);
      setBackendError(err.message || String(err));
      setCurrentGesture(GESTURES.UNKNOWN);
    } finally {
      setIsLoading(false);
    }
  };

  // Start game and countdown
  const startGame = () => {
    setIsDetecting(true);
    setCountdown(3);
    setCurrentGesture(GESTURES.UNKNOWN);
    setLastDetectedGesture(GESTURES.UNKNOWN);
    setBackendError(null);
  };

  // Countdown logic
  useEffect(() => {
    if (countdown === null || countdown === 0) return;
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // When countdown ends, play round
  useEffect(() => {
    if (countdown === 0) {
      setIsDetecting(false);
      
      if (lastDetectedGesture && lastDetectedGesture !== GESTURES.UNKNOWN) {
        const userGesture = lastDetectedGesture;
        const aiGesture = getAIMove();
        const result = getGameResult(userGesture, aiGesture);
        console.log('🎯 Game round - userGesture:', userGesture, 'aiGesture:', aiGesture, 'result:', result);
        onGameResult({ userGesture, aiGesture, result });
      } else {
        // Detection failed, let user retry or show error
        console.warn('Detection failed or gesture unknown. Please try again.');
      }

    }
  }, [countdown, lastDetectedGesture, onGameResult]);

  // Retry backend connection
  const retryConnection = () => {
    setIsBackendReady(false);
    setBackendError(null);
    checkBackendStatus();
  };

  if (backendError) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F44336" />
        <Text style={{ color: '#F44336', margin: 10, textAlign: 'center' }}>
          Error contacting backend:
        </Text>
        <Text style={{ color: '#F44336', margin: 10, textAlign: 'center' }}>
          {backendError}
        </Text>
        <Text style={{ color: '#333', margin: 10, textAlign: 'center' }}>
          Make sure your backend server is running
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryConnection}>
          <Text style={styles.retryButtonText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isBackendReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ margin: 20, textAlign: 'center' }}>
          Connecting to backend for gesture detection...
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryConnection}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={'front'}
          ref={(ref) => setCameraRef(ref)}
        />
        <View style={styles.overlay}>
          {isLoading ? (
            <View style={styles.countdownContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
            </View>
          ) : countdown !== null && countdown > 0 ? (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          ) : (
            <View style={styles.detectionInfo}>
              <Text style={styles.gestureText}>
                Detected Gesture: {getGestureEmoji(currentGesture)} {currentGesture.toUpperCase()}
              </Text>
              <Text style={styles.instruction}>
                Show your hand (rock, paper, or scissors) in front of the camera!
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.controls}>
        {!isDetecting && !isLoading ? (
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.playingText}>Game in progress... Detecting gesture</Text>
        )}
        <View style={styles.gestureGuide}>
          <Text style={styles.guideTitle}>Gesture Guide:</Text>
          <View style={styles.gestureList}>
            <View style={styles.gestureItem}>
              <Text style={styles.gestureEmoji}>✊</Text>
              <Text style={styles.gestureLabel}>Rock</Text>
            </View>
            <View style={styles.gestureItem}>
              <Text style={styles.gestureEmoji}>✋</Text>
              <Text style={styles.gestureLabel}>Paper</Text>
            </View>
            <View style={styles.gestureItem}>
              <Text style={styles.gestureEmoji}>✌️</Text>
              <Text style={styles.gestureLabel}>Scissors</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  detectionInfo: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gestureText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  controls: {
    padding: 20,
    backgroundColor: '#fff',
    width: '100%',
  },
  startButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  gestureGuide: {
    marginTop: 10,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  gestureList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gestureItem: {
    alignItems: 'center',
  },
  gestureEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  gestureLabel: {
    fontSize: 12,
    color: '#666',
  },
});
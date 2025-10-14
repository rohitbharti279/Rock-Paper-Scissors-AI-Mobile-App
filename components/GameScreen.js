import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { CameraView } from 'expo-camera';
import { GESTURES, getAIMove, getGameResult, mapMediaPipeGesture, getGestureEmoji } from '../utils/gameLogic';

const { width } = Dimensions.get('window');

export default function GameScreen({ onGameResult }) {
  const cameraRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [currentGesture, setCurrentGesture] = useState(GESTURES.UNKNOWN);
  const [lastDetectedGesture, setLastDetectedGesture] = useState(GESTURES.UNKNOWN);

  // // Simulated MediaPipe integration
  // const simulateGestureDetection = () => {
  //   if (!isDetecting) return;

  //   // In a real implementation, this would process camera frames with MediaPipe
  //   // For this demo, we'll simulate gesture detection based on random input
  //   const gestures = [GESTURES.ROCK, GESTURES.PAPER, GESTURES.SCISSORS, GESTURES.UNKNOWN];
  //   const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
    
  //   setCurrentGesture(randomGesture);
    
  //   // Store the last valid gesture for game play
  //   if (randomGesture !== GESTURES.UNKNOWN) {
  //     setLastDetectedGesture(randomGesture);
  //   }
  // };

  // User gesture selection handler
  const handleGestureSelect = (gesture) => {
    setCurrentGesture(gesture);
    setLastDetectedGesture(gesture);
  };

  const startGame = () => {
    setIsDetecting(true);
    setCountdown(3);
    setCurrentGesture(GESTURES.UNKNOWN);
  };

  // useEffect(() => {
  //   let detectionInterval;
    
  //   if (isDetecting) {
  //     detectionInterval = setInterval(simulateGestureDetection, 500);
  //   }

  //   return () => {
  //     if (detectionInterval) {
  //       clearInterval(detectionInterval);
  //     }
  //   };
  // }, [isDetecting]);

  useEffect(() => {
    let countdownInterval;

    if (countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Game round complete
      setIsDetecting(false);
      
      const aiGesture = getAIMove();
      const result = getGameResult(lastDetectedGesture, aiGesture);
      
      onGameResult({
        userGesture: lastDetectedGesture,
        aiGesture,
        result
      });
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [countdown, lastDetectedGesture, onGameResult]);

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
        >
          <View style={styles.overlay}>
            {countdown !== null && countdown > 0 && (
              <View style={styles.countdownContainer}>
                <Text style={styles.countdownText}>{countdown}</Text>
              </View>
            )}
            
            {isDetecting && (
              <View style={styles.detectionInfo}>
                <Text style={styles.gestureText}>
                  Current: {getGestureEmoji(currentGesture)}
                </Text>
                <Text style={styles.instruction}>
                  {/* Show your hand! {lastDetectedGesture !== GESTURES.UNKNOWN && 
                    `Detected: ${lastDetectedGesture}`
                  } */}
                  Select your gesture below:
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  {[GESTURES.ROCK, GESTURES.PAPER, GESTURES.SCISSORS].map(gesture => (
                    <TouchableOpacity
                      key={gesture}
                      style={{ marginHorizontal: 10, padding: 10, backgroundColor: '#2196F3', borderRadius: 10 }}
                      onPress={() => handleGestureSelect(gesture)}
                    >
                      <Text style={{ color: '#fff', fontSize: 24 }}>{getGestureEmoji(gesture)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </CameraView>
      </View>

      <View style={styles.controls}>
        {!isDetecting ? (
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.playingText}>Game in progress...</Text>
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
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
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
  },
  gestureText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  controls: {
    padding: 20,
    backgroundColor: '#fff',
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
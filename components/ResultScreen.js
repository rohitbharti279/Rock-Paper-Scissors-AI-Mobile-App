import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { getGestureEmoji, getResultColor, getResultText } from '../utils/gameLogic';

export default function ResultScreen({ result, onPlayAgain }) {
  const { userGesture, aiGesture, result: gameResult } = result;

  return (
    <View style={styles.container}>
      <View style={styles.resultCard}>
        <Text style={[styles.resultText, { color: getResultColor(gameResult) }]}>
          {getResultText(gameResult)}
        </Text>

        <View style={styles.gesturesContainer}>
          <View style={styles.gestureSection}>
            <Text style={styles.sectionTitle}>Your Move</Text>
            <Text style={styles.gestureEmoji}>{getGestureEmoji(userGesture)}</Text>
            <Text style={styles.gestureName}>{userGesture.toUpperCase()}</Text>
          </View>

          <Text style={styles.vsText}>VS</Text>

          <View style={styles.gestureSection}>
            <Text style={styles.sectionTitle}>AI Move</Text>
            <Text style={styles.gestureEmoji}>{getGestureEmoji(aiGesture)}</Text>
            <Text style={styles.gestureName}>{aiGesture.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.rules}>
          <Text style={styles.rulesTitle}>Game Rules:</Text>
          <Text style={styles.rule}>✊ Rock beats ✌️ Scissors</Text>
          <Text style={styles.rule}>✋ Paper beats ✊ Rock</Text>
          <Text style={styles.rule}>✌️ Scissors beats ✋ Paper</Text>
        </View>

        <TouchableOpacity style={styles.playAgainButton} onPress={onPlayAgain}>
          <Text style={styles.playAgainText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  gesturesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  gestureSection: {
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  gestureEmoji: {
    fontSize: 48,
    marginBottom: 5,
  },
  gestureName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  vsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    marginHorizontal: 10,
  },
  rules: {
    width: '100%',
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  rule: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  playAgainButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  playAgainText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
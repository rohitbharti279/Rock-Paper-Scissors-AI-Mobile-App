# backend/controllMediapipe_detect.py
import sys
import cv2
import mediapipe as mp
import numpy as np
import traceback

GESTURES = {
    'ROCK': 'rock',
    'PAPER': 'paper',
    'SCISSORS': 'scissors',
    'UNKNOWN': 'unknown'
}

def map_gesture(landmarks):
    try:
        if not landmarks or len(landmarks) < 21:
            return GESTURES['UNKNOWN']
        
        tips = [landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]]
        wrist = landmarks[0]
        
        distances = [np.linalg.norm(np.array([tip.x, tip.y]) - np.array([wrist.x, wrist.y])) for tip in tips]
        avg_finger_distance = np.mean(distances[1:])  # exclude thumb
        
        # Rock: all fingers closed
        if avg_finger_distance < 0.15:
            return GESTURES['ROCK']
        
        # Paper: all fingers open
        if all(d > 0.2 for d in distances[1:]):
            return GESTURES['PAPER']
        
        # Scissors: index and middle open, others closed
        if distances[1] > 0.2 and distances[2] > 0.2 and distances[3] < 0.15 and distances[4] < 0.15:
            return GESTURES['SCISSORS']
            
        return GESTURES['UNKNOWN']
    except Exception:
        return GESTURES['UNKNOWN']

def main(image_path):
    try:
        mp_hands = mp.solutions.hands
        hands = mp_hands.Hands(
            static_image_mode=True, 
            max_num_hands=1,
            min_detection_confidence=0.5
        )
        
        image = cv2.imread(image_path)
        if image is None:
            print(GESTURES['UNKNOWN'])
            return
            
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = hands.process(image_rgb)
        
        if results.multi_hand_landmarks:
            landmarks = results.multi_hand_landmarks[0].landmark
            gesture = map_gesture(landmarks)
            print(gesture)
        else:
            print(GESTURES['UNKNOWN'])
            
    except Exception as e:
        print(f"Error in main: {e}")
        print(GESTURES['UNKNOWN'])

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(GESTURES['UNKNOWN'])
    else:
        main(sys.argv[1])
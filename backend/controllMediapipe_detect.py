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
        print(f"[DEBUG] Finger distances: {distances}")
        print(f"[DEBUG] Avg finger distance: {avg_finger_distance}")

        # Looser, more tolerant gesture detection:
        # Rock: all fingers (except thumb) close to wrist
        if all(d < 0.35 for d in distances[1:]):
            print(f"[DEBUG] Detected ROCK gesture. distances: {distances[1:]}")
            return GESTURES['ROCK']

        # Paper: all fingers (except thumb) far from wrist
        if all(d > 0.5 for d in distances[1:]):
            print(f"[DEBUG] Detected PAPER gesture. distances: {distances[1:]}")
            return GESTURES['PAPER']

        # Scissors: index and middle far, ring and pinky close
        if distances[1] > 0.5 and distances[2] > 0.5 and distances[3] < 0.3 and distances[4] < 0.3:
            print(f"[DEBUG] Detected SCISSORS gesture. distances: {distances[1:]}")
            return GESTURES['SCISSORS']

        print(f"[DEBUG] Gesture UNKNOWN. distances: {distances[1:]}")
        return GESTURES['UNKNOWN']
    except Exception:
        import traceback
        traceback.print_exc()
        return GESTURES['UNKNOWN']

def main(image_path):
    try:
        mp_hands = mp.solutions.hands
        hands = mp_hands.Hands(
            static_image_mode=True, 
            max_num_hands=1,
            min_detection_confidence=0.5
        )
        
        print(f"[DEBUG] Loading image: {image_path}")
        image = cv2.imread(image_path)
        if image is None:
            print(f"[ERROR] Could not load image: {image_path}")
            print(GESTURES['UNKNOWN'])
            hands.close()
            return
        print(f"[DEBUG] Image shape: {image.shape}")
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = hands.process(image_rgb)
        if results.multi_hand_landmarks:
            print("[DEBUG] Hand landmarks detected.")
            landmarks = results.multi_hand_landmarks[0].landmark
            gesture = map_gesture(landmarks)
            print(f"[DEBUG] Gesture detected: {gesture}")
            print(gesture)
        else:
            print("[DEBUG] No hand landmarks detected.")
            print(GESTURES['UNKNOWN'])
        hands.close()
    except Exception as e:
        print(f"Error in main: {e}")
        import traceback
        traceback.print_exc()
        print(GESTURES['UNKNOWN'])

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(GESTURES['UNKNOWN'])
    else:
        main(sys.argv[1])
// Game logic utilities
export const GESTURES = {
  ROCK: 'rock',
  PAPER: 'paper',
  SCISSORS: 'scissors',
  UNKNOWN: 'unknown'
};

export const RESULTS = {
  WIN: 'win',
  LOSE: 'lose',
  DRAW: 'draw'
};

// Determine game result
export const getGameResult = (userGesture, aiGesture) => {
  if (userGesture === aiGesture) {
    return RESULTS.DRAW;
  }

  if (
    (userGesture === GESTURES.ROCK && aiGesture === GESTURES.SCISSORS) ||
    (userGesture === GESTURES.PAPER && aiGesture === GESTURES.ROCK) ||
    (userGesture === GESTURES.SCISSORS && aiGesture === GESTURES.PAPER)
  ) {
    return RESULTS.WIN;
  }

  return RESULTS.LOSE;
};

// Get AI's random move
export const getAIMove = () => {
  const moves = [GESTURES.ROCK, GESTURES.PAPER, GESTURES.SCISSORS];
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
};

// Map MediaPipe gestures to our game gestures
export const mapMediaPipeGesture = (landmarks) => {
  if (!landmarks || landmarks.length === 0) return GESTURES.UNKNOWN;
  
  // Simple heuristic-based gesture detection
  // In a real app, you'd use MediaPipe's gesture classification
  const tips = {
    thumb: landmarks[4],
    index: landmarks[8],
    middle: landmarks[12],
    ring: landmarks[16],
    pinky: landmarks[20],
    wrist: landmarks[0]
  };

  // Calculate distances between fingertips and wrist
  const distances = {
    thumb: Math.hypot(tips.thumb.x - tips.wrist.x, tips.thumb.y - tips.wrist.y),
    index: Math.hypot(tips.index.x - tips.wrist.x, tips.index.y - tips.wrist.y),
    middle: Math.hypot(tips.middle.x - tips.wrist.x, tips.middle.y - tips.wrist.y),
    ring: Math.hypot(tips.ring.x - tips.wrist.x, tips.ring.y - tips.wrist.y),
    pinky: Math.hypot(tips.pinky.x - tips.wrist.x, tips.pinky.y - tips.wrist.y),
  };

  const avgFingerDistance = (distances.index + distances.middle + distances.ring + distances.pinky) / 4;

  // Rock: All fingers close to wrist
  if (avgFingerDistance < 0.15) {
    return GESTURES.ROCK;
  }

  // Paper: All fingers extended
  if (distances.index > 0.2 && distances.middle > 0.2 && distances.ring > 0.2 && distances.pinky > 0.2) {
    return GESTURES.PAPER;
  }

  // Scissors: Index and middle extended, others closed
  if (distances.index > 0.2 && distances.middle > 0.2 && distances.ring < 0.15 && distances.pinky < 0.15) {
    return GESTURES.SCISSORS;
  }

  return GESTURES.UNKNOWN;
};

// Get emoji for gesture
export const getGestureEmoji = (gesture) => {
  switch (gesture) {
    case GESTURES.ROCK: return '✊';
    case GESTURES.PAPER: return '✋';
    case GESTURES.SCISSORS: return '✌️';
    default: return '❓';
  }
};

// Get color for result
export const getResultColor = (result) => {
  switch (result) {
    case RESULTS.WIN: return '#4CAF50';
    case RESULTS.LOSE: return '#F44336';
    case RESULTS.DRAW: return '#FF9800';
    default: return '#9E9E9E';
  }
};

// Get display text for result
export const getResultText = (result) => {
  switch (result) {
    case RESULTS.WIN: return 'You Win! 🎉';
    case RESULTS.LOSE: return 'You Lose! 💫';
    case RESULTS.DRAW: return 'Draw! 🤝';
    default: return 'Unknown';
  }
};
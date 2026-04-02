export const getMessage = (type: string, progress: number) => {
  if (type === 'zippy') {
    if (progress === 0) return "Let's start strong today";
    if (progress < 0.5) return "keep going, you're warming up!";
    return "You're on fire!  finish it!";
  }

  if (type === 'sage') {
    if (progress === 0) return 'stay focused One step at a time';
    if (progress < 0.5) return "keep up the good work, you're warming up!";
    return "You're doing great! Keep up the good work!";
  }

  if (type === 'bubbles') {
    if (progress === 0) return "Let's make studying fun today!";
    if (progress < 0.5) return "keep going, you're warming up!";
    return "You're the MVP! Keep it up!";
  }

  return 'lets study';
};

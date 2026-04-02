export type StudyPalType = {
  name: string;
  emoji: string;
  personality: string;
};

export type StudyPalMessage = {
  text: string;
  mood: 'normal' | 'hype' | 'calm';
};

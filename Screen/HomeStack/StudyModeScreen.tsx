import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/progressBar';
import { useState, useRef } from 'react';
import type { FirestoreSubject } from '../../Service/subjectService';
import { updateStreak, updateProgress } from '../../Service/statsService';
import { auth } from '../../firebaseConfig';

type Card = {
  id: string;
  question: string;
  answer: string;
};

export default function StudyModeScreen({ route }: any) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { subject, cards } = route.params as {
    subject: FirestoreSubject;
    cards: Card[];
  };

  // ── state ──────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [progress, setProgress] = useState<
    ('correct' | 'wrong' | 'unanswered')[]
  >(Array.from({ length: cards.length }, () => 'unanswered'));

  // ── refs ───────────────────────────────────────────
  const isFlipped = useRef(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // ── interpolations ─────────────────────────────────
  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  // ── handlers ───────────────────────────────────────
  const handleFlip = () => {
    isFlipped.current = !isFlipped.current;
    setShowButtons(isFlipped.current);
    Animated.spring(flipAnim, {
      toValue: isFlipped.current ? 1 : 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const nextCard = () => {
    Animated.timing(slideAnim, {
      toValue: -400,
      duration: 250,
      useNativeDriver: true,
    }).start(async () => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        isFlipped.current = false;
        setShowButtons(false);
        flipAnim.setValue(0);
      } else {
        await handleSessionComplete(); // ← replaces setFinished(true)
      }
      slideAnim.setValue(400);
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleGotIt = () => {
    const updated = [...progress];
    updated[currentIndex] = 'correct';
    setProgress(updated);
    setScore(score + 1);
    nextCard();
  };

  const handleMissedIt = () => {
    const updated = [...progress];
    updated[currentIndex] = 'wrong';
    setProgress(updated);
    nextCard();
  };

  const currentCard = cards[currentIndex];

  const handleSessionComplete = async () => {
    const uid = auth.currentUser?.uid ?? '';
    if (!uid) return;
    await Promise.all([updateStreak(uid), updateProgress(uid)]);
    setFinished(true);
  };

  // ── finished screen ────────────────────────────────
  if (finished) {
    return (
      <View style={styles.finishedContainer}>
        <Text style={styles.finishedEmoji}>
          {score === cards.length
            ? '🎉'
            : score >= cards.length / 2
              ? '👍'
              : '💪'}
        </Text>
        <Text style={styles.scoreText}>
          {score}/{cards.length}
        </Text>
        <Text style={styles.scoreLabel}>
          {score === cards.length
            ? 'Perfect score!'
            : score >= cards.length / 2
              ? 'Good job!'
              : 'Keep practicing!'}
        </Text>
        <View style={styles.finishedButtons}>
          <Button
            label="Study again"
            onPress={() => {
              setCurrentIndex(0);
              setScore(0);
              setFinished(false);
              setShowButtons(false);
              isFlipped.current = false;
              flipAnim.setValue(0);
              slideAnim.setValue(0);
              setProgress(
                Array.from({ length: cards.length }, () => 'unanswered'),
              );
            }}
            fullWidth
          />
          <Button
            label="Back to subject"
            onPress={() => navigation.goBack()}
            variant="ghost"
            fullWidth
          />
        </View>
      </View>
    );
  }

  // ── main screen ────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </Pressable>
        <Text style={styles.subjectName}>{subject.name}</Text>
        <Text style={styles.cardCounter}>
          {currentIndex + 1}/{cards.length}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <ProgressBar
          total={cards.length}
          currentIndex={currentIndex}
          progress={progress}
        />
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.cardWrapper,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <Pressable onPress={handleFlip} style={styles.cardTouchable}>
            {/* Front face */}
            <Animated.View
              style={[
                styles.card,
                styles.cardFront,
                { transform: [{ rotateY: frontRotate }] },
              ]}
            >
              <Text style={styles.cardLabel}>QUESTION</Text>
              <Text style={styles.cardText}>{currentCard.question}</Text>
              <Text style={styles.tapHint}>Tap to reveal answer</Text>
            </Animated.View>

            {/* Back face */}
            <Animated.View
              style={[
                styles.card,
                styles.cardBack,
                { transform: [{ rotateY: backRotate }] },
              ]}
            >
              <Text style={styles.cardLabel}>ANSWER</Text>
              <Text style={styles.cardText}>{currentCard.answer}</Text>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </View>

      {/* Got it / Missed it */}
      {showButtons ? (
        <View style={styles.buttonContainer}>
          <Button label="Got it ✓" onPress={handleGotIt} variant="success" />
          <Button label="Missed it" onPress={handleMissedIt} variant="danger" />
        </View>
      ) : (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>Tap the card to flip it</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    backgroundColor: '#1a1a2e',
    padding: 10,
    borderRadius: 12,
    width: 44,
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardCounter: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
    width: 44,
    textAlign: 'right',
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: '100%',
    height: 300,
  },
  cardTouchable: {
    width: '100%',
    height: '100%',
  },
  card: {
    borderRadius: 24,
    padding: 32,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardFront: {
    backgroundColor: '#1a1a2e',
    backfaceVisibility: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a4e',
  },
  cardBack: {
    backgroundColor: '#2a1a3e',
    backfaceVisibility: 'hidden',
    borderWidth: 1,
    borderColor: '#3a2a5e',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C63FF',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  cardText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
  },
  tapHint: {
    fontSize: 12,
    color: '#444444',
    marginTop: 24,
  },
  hintContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  hintText: {
    color: '#444444',
    fontSize: 13,
  },
  buttonContainer: {
    flexDirection: 'row',

    paddingBottom: 68,
    justifyContent: 'center',
    gap: 12,
  },
  finishedContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  finishedEmoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 52,
    fontWeight: '800',
    color: '#ffffff',
  },
  scoreLabel: {
    fontSize: 18,
    color: '#888888',
    fontWeight: '600',
  },
  finishedButtons: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
});

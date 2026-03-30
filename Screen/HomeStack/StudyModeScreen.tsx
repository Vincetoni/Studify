import { View, Text, StyleSheet, Animated, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { flashcards } from '../../Data/FlashCard'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/progressBar'
import { useState, useRef } from 'react'

export default function StudyModeScreen({ route }: any) {
  const navigation = useNavigation()
  const { subject } = route.params
  const subjectCards = flashcards.filter(card => card.subjectId === subject.id)

  // ── state ──────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [progress, setProgress] = useState<('correct' | 'wrong' | 'unanswered')[]>(
    Array.from({ length: subjectCards.length }, () => 'unanswered')
  )

  // ── refs ───────────────────────────────────────────
  const isFlipped = useRef(false)
  const flipAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(0)).current

  // ── interpolations ─────────────────────────────────
  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  })

  // ── handlers ───────────────────────────────────────
  const handleFlip = () => {
    isFlipped.current = !isFlipped.current
    setShowButtons(isFlipped.current)

    Animated.spring(flipAnim, {
      toValue: isFlipped.current ? 1 : 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  const nextCard = () => {
    Animated.timing(slideAnim, {
      toValue: -400,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (currentIndex < subjectCards.length - 1) {
        setCurrentIndex(currentIndex + 1)
        isFlipped.current = false
        setShowButtons(false)
        flipAnim.setValue(0)
      } else {
        setFinished(true)
      }

      slideAnim.setValue(400)

      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        useNativeDriver: true,
      }).start()
    })
  }

  const handleGotIt = () => {
    const updated = [...progress]
    updated[currentIndex] = 'correct'
    setProgress(updated)
    setScore(score + 1)
    nextCard()
  }

  const handleMissedIt = () => {
    const updated = [...progress]
    updated[currentIndex] = 'wrong'
    setProgress(updated)
    nextCard()
  }

  const currentCard = subjectCards[currentIndex]

  // ── finished screen ────────────────────────────────
  if (finished) {
    return (
      <View style={styles.finishedContainer}>
        <Text style={styles.finishedEmoji}>
          {score === subjectCards.length ? '🎉' : score >= subjectCards.length / 2 ? '👍' : '💪'}
        </Text>
        <Text style={styles.scoreText}>
          {score}/{subjectCards.length}
        </Text>
        <Text style={styles.scoreLabel}>
          {score === subjectCards.length ? 'Perfect score!' : score >= subjectCards.length / 2 ? 'Good job!' : 'Keep practicing!'}
        </Text>
        <View style={styles.finishedButtons}>
          <Button label="Back to Subject" onPress={() => navigation.goBack()} variant="ghost" fullWidth />
        </View>
      </View>
    )
  }

  // ── main screen ────────────────────────────────────
  return (
    <View style={styles.container}>

      {/* Back button */}
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.subjectName}>{subject.name}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <ProgressBar
          total={subjectCards.length}
          currentIndex={currentIndex}
          progress={progress}
        />
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <Animated.View style={[
          styles.cardWrapper,
          { transform: [{ translateX: slideAnim }] }
        ]}>
          <Pressable onPress={handleFlip} style={styles.cardTouchable}>

            {/* Front face */}
            <Animated.View style={[
              styles.card,
              styles.cardFront,
              { transform: [{ rotateY: frontRotate }] }
            ]}>
              <Text style={styles.cardLabel}>QUESTION</Text>
              <Text style={styles.cardText}>{currentCard.question}</Text>
              <Text style={styles.tapHint}>Tap to reveal answer</Text>
            </Animated.View>

            {/* Back face */}
            <Animated.View style={[
              styles.card,
              styles.cardBack,
              { transform: [{ rotateY: backRotate }] }
            ]}>
              <Text style={styles.cardLabel}>ANSWER</Text>
              <Text style={styles.cardText}>{currentCard.answer}</Text>
            </Animated.View>

          </Pressable>
        </Animated.View>
      </View>

      {/* Counter */}
      <Text style={styles.progressText}>
        {currentIndex + 1} / {subjectCards.length}
      </Text>

      {/* Got it / Missed it buttons */}
      {showButtons && (
        <View style={styles.buttonContainer}>
          <Button label="Got it ✓" onPress={handleGotIt} variant="success" />
          <Button label="Missed it" onPress={handleMissedIt} variant="danger" />
        </View>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 16,
  },
  backButton: {
    backgroundColor: '#1a1a2e',
    padding: 10,
    borderRadius: 12,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  progressBarContainer: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  cardWrapper: {
    width: '100%',
    height: 280,
  },
  cardTouchable: {
    width: '100%',
    height: '100%',
  },
  card: {
    borderRadius: 20,
    padding: 28,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  cardFront: {
    backgroundColor: '#1a1a2e',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#2a1a3e',
    backfaceVisibility: 'hidden',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C63FF',
    letterSpacing: 1,
    marginBottom: 16,
  },
  cardText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
  },
  tapHint: {
    fontSize: 12,
    color: '#555555',
    marginTop: 20,
  },
  progressText: {
    color: '#888888',
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingBottom: 32,
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
    fontSize: 64,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
  },
  scoreLabel: {
    fontSize: 18,
    color: '#888888',
    fontWeight: '600',
  },
  finishedButtons: {
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
})
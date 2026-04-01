import { View, Text, StyleSheet, Animated, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/progressBar'
import { useState, useRef } from 'react'
import type { FirestoreSubject } from '../../Service/subjectService'

type Card = {
  id: string
  question: string
  answer: string
}

export default function StudyModeScreen({ route }: any) {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { subject, cards } = route.params as { subject: FirestoreSubject, cards: Card[] }

  // ── state ──────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [progress, setProgress] = useState<('correct' | 'wrong' | 'unanswered')[]>(
    Array.from({ length: cards.length }, () => 'unanswered')
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
      if (currentIndex < cards.length - 1) {
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
    setScore(score + 1
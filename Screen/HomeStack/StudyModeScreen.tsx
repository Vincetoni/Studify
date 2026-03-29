import { View, Text, StyleSheet, FlatList, } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { flashcards } from '../../Data/FlashCard'
import Button from '../../components/ui/Button'
import { useState } from 'react'
import ProgressBar from '../../components/ui/progressBar'

export default function StudyModeScreen ({ route }: any) {
    const navigation = useNavigation()
    const { subject } = route.params
    const subjectCards = flashcards.filter(card => card.subjectId === subject.id)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)
    const [progress, setProgress] = useState<('correct' | 'wrong' | 'unanswered')[]>(
     Array.from({ length: subjectCards.length }, () => 'unanswered')
    )

    const currentCard = subjectCards[currentIndex]

    const handleFlip = () => setIsFlipped(!isFlipped)

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

    const nextCard = () => {
        if (currentIndex < subjectCards.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setIsFlipped(false)
        } else {
            setFinished(true)
        }
    }

    if (finished) {
        return (
            <View style={styles.Finishedcontainer}>
                <Text style={styles.scoreText}>Your Score: {score}/{subjectCards.length}</Text>
                <Text style={{color:'#888888', paddingBottom:28, paddingTop:6, fontWeight:'bold'}}>
                    {score === subjectCards.length ? 'Perfect score! 🎉' : score >= subjectCards.length / 2 ? 'Good job! 👍' : 'Keep practicing! 💪'}
                </Text>
                <Button  label="Back to Subject" onPress={() => navigation.goBack()} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </Pressable>
            </View>
            
          <View style={{ marginTop: 100 }}>
            <ProgressBar
              total={subjectCards.length}
              currentIndex={currentIndex}
              progress={progress}
            />
          </View>

            <View style={styles.cardContainer}>
                <Pressable style={styles.card} onPress={handleFlip}>
                    <Text style={styles.cardText}>
                        {isFlipped ? currentCard.answer : currentCard.question}
                    </Text>
                </Pressable>
            </View>

            {isFlipped && (
                <View style={styles.buttonContainer}>
                    <Button label="Got it" onPress={handleGotIt} variant="success" />
                    <Button label="Missed it" onPress={handleMissedIt} variant="danger" />
                </View>
            )}

            <Text style={styles.progressText}>
                {currentIndex + 1} / {subjectCards.length}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  topBar: {
    position: 'absolute',
    top: 52,
    left: 24,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: '#1a1a2e',
    padding: 10,
    borderRadius: 12,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  progressText: {
    color: '#888888',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
    fontWeight:'bold',
    marginTop: 100,
  },
  progressBar:{
    height: 4,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#1a1a2e',
    marginHorizontal: 2,
  },
  Finishedcontainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
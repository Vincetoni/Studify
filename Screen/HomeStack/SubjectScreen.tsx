import { View, Text, StyleSheet, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { flashcards } from '../../Data/FlashCard'
import Button from '../../components/ui/Button'

export default function SubjectScreen({ route }: any) {
  const { subject } = route.params
  const navigation = useNavigation<any>()

  // get only cards for this subject
  const subjectCards = flashcards.filter(card => card.subjectId === subject.id)

  return (
    <View style={styles.container}>

      {/* Back button */}
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
      </View>

      {/* Subject info */}
      <View style={styles.subjectInfo}>
        <Text style={styles.icon}>{subject.icon}</Text>
        <Text style={styles.name}>{subject.name}</Text>
        <Text style={styles.cardCount}>{subjectCards.length} cards</Text>
      </View>

      {/* Cards preview list */}
      <FlatList
        data={subjectCards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.cardPreview}>
            <Text style={styles.cardNumber}>Card {index + 1}</Text>
            <Text style={styles.cardQuestion}>{item.question}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No cards yet for this subject</Text>
        }
      />

      {/* Study button */}
      {subjectCards.length > 0 && (
        <View style={styles.studyBtnContainer}>
          <Button
            label="Study Now 🚀"
            onPress={() => navigation.navigate('StudyMode', {
              subject,
              cards: subjectCards,
            })}
            fullWidth
          />
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
  subjectInfo: {
    alignItems: 'center',
    paddingTop: 120,
    paddingBottom: 24,
    gap: 8,
  },
  icon: {
    fontSize: 64,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardCount: {
    fontSize: 14,
    color: '#888888',
  },
  list: {
    paddingHorizontal: 24,
    gap: 12,
  },
  cardPreview: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  cardNumber: {
    fontSize: 11,
    color: '#6C63FF',
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardQuestion: {
    fontSize: 15,
    color: '#ffffff',
  },
  emptyText: {
    color: '#888888',
    textAlign: 'center',
    marginTop: 40,
  },
  studyBtnContainer: {
    padding: 24,
  },
})
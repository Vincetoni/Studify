import {
  View, Text, StyleSheet, FlatList,
  Pressable, Modal, TextInput, ActivityIndicator
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { auth } from '../../firebaseConfig'
import Button from '../../components/ui/Button'
import type { FirestoreSubject } from '../../Service/subjectService'
import {
  getFlashcards,
  addFlashcard,
  deleteFlashcard,
  Flashcard
} from '../../Service/flashcardService'

export default function SubjectScreen({ route }: any) {
  const { subject } = route.params as { subject: FirestoreSubject }
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const uid = auth.currentUser?.uid ?? ''

  const [cards, setCards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    setLoading(true)
    const data = await getFlashcards(uid, subject.id)
    setCards(data)
    setLoading(false)
  }

  const handleAddCard = async () => {
    if (question.trim().length < 3) {
      setError('Question must be at least 3 characters')
      return
    }
    if (answer.trim().length < 1) {
      setError('Answer cannot be empty')
      return
    }
    setError('')
    setAdding(true)
    await addFlashcard(uid, subject.id, question, answer)
    await loadCards()
    setQuestion('')
    setAnswer('')
    setModalVisible(false)
    setAdding(false)
  }

  const handleDeleteCard = async (cardId: string) => {
    await deleteFlashcard(uid, subject.id, cardId)
    setCards(prev => prev.filter(c => c.id !== cardId))
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>{subject.name}</Text>
        <Pressable
          style={styles.addCardBtn}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={22} color="#6C63FF" />
        </Pressable>
      </View>

      {/* Subject info */}
      <View style={styles.subjectInfo}>
        <Text style={styles.icon}>{subject.icon}</Text>
        <Text style={styles.name}>{subject.name}</Text>
        <View style={styles.statRow}>
          <View style={styles.statBadge}>
            <Ionicons name="albums-outline" size={14} color="#6C63FF" />
            <Text style={styles.statText}>{cards.length} cards</Text>
          </View>
          <View style={styles.statBadge}>
            <Ionicons name="time-outline" size={14} color="#6C63FF" />
            <Text style={styles.statText}>
              {subject.lastStudied === 'Never' ? 'Not studied yet' : subject.lastStudied}
            </Text>
          </View>
        </View>
      </View>

      {/* Cards list */}
      {loading ? (
        <ActivityIndicator
          color="#6C63FF"
          style={{ marginTop: 40 }}
          size="large"
        />
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            cards.length > 0
              ? <Text style={styles.listHeader}>FLASHCARDS</Text>
              : null
          }
          renderItem={({ item, index }) => (
            <View style={styles.cardPreview}>
              <View style={styles.cardPreviewTop}>
                <Text style={styles.cardNumber}>Card {index + 1}</Text>
                <Pressable onPress={() => handleDeleteCard(item.id)}>
                  <Ionicons name="trash-outline" size={16} color="#ff4d4d" />
                </Pressable>
              </View>
              <Text style={styles.cardQuestion}>{item.question}</Text>
              <Text style={styles.cardAnswer}>{item.answer}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>No cards yet</Text>
              <Text style={styles.emptySubtext}>
                Tap + to add your first flashcard
              </Text>
            </View>
          }
        />
      )}

      {/* Bottom study button */}
      {cards.length > 0 && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <Button
            label={`Study Now 🚀  (${cards.length} cards)`}
            onPress={() => navigation.navigate('StudyMode', {
              subject,
              cards,
            })}
            fullWidth
          />
        </View>
      )}

      {/* Add card modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.modalCard}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>New Flashcard</Text>

            <Text style={styles.modalLabel}>QUESTION</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. What is Newton's Second Law?"
              placeholderTextColor="#444"
              value={question}
              onChangeText={(t) => {
                setQuestion(t)
                setError('')
              }}
              multiline
              autoFocus
            />

            <Text style={styles.modalLabel}>ANSWER</Text>
            <TextInput
              style={[styles.input, styles.answerInput]}
              placeholder="e.g. F = ma"
              placeholderTextColor="#444"
              value={answer}
              onChangeText={(t) => {
                setAnswer(t)
                setError('')
              }}
              multiline
            />

            {error !== '' && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            {adding ? (
              <ActivityIndicator color="#6C63FF" style={{ marginTop: 8 }} />
            ) : (
              <Button
                label="Add Card"
                onPress={handleAddCard}
                fullWidth
              />
            )}

            <Pressable onPress={() => {
              setModalVisible(false)
              setQuestion('')
              setAnswer('')
              setError('')
            }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

          </Pressable>
        </Pressable>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    backgroundColor: '#1a1a2e',
    padding: 10,
    borderRadius: 12,
    width: 44,
    alignItems: 'center',
  },
  addCardBtn: {
    backgroundColor: '#1a1a2e',
    padding: 10,
    borderRadius: 12,
    width: 44,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  subjectInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  icon: {
    fontSize: 64,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1a1a2e',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a4e',
  },
  statText: {
    fontSize: 12,
    color: '#aaaaaa',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  listHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#555555',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  cardPreview: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#222235',
  },
  cardPreviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: '600',
    lineHeight: 22,
  },
  cardAnswer: {
    fontSize: 13,
    color: '#888888',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555555',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#444444',
    textAlign: 'center',
  },
  bottomBar: {
    padding: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#1a1a1a',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#141420',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#1e1e30',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#555555',
    letterSpacing: 1.5,
  },
  input: {
    backgroundColor: '#0f0f0f',
    borderRadius: 12,
    padding: 14,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#222235',
    minHeight: 52,
  },
  answerInput: {
    minHeight: 80,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 13,
  },
  cancelText: {
    color: '#555555',
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 4,
  },
})

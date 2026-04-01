import {
  View, Text, StyleSheet, ScrollView, FlatList,
  Pressable, Modal, TextInput, ActivityIndicator
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { auth, db } from '../../firebaseConfig'
import { doc, onSnapshot } from 'firebase/firestore'
import { getSubjects, addSubject, deleteSubject, FirestoreSubject } from '../../Service/subjectService'
import SubjectCard from '../subjectCard'

// ── Continue studying card ──────────────────────────────
const ContinueStudy = ({ item, onPress }: { item: FirestoreSubject, onPress: () => void }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.cardRow}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardIcon}>{item.icon}</Text>
        <View>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardMeta}>Last studied: {item.lastStudied}</Text>
        </View>
      </View>
      <View style={styles.resumeBtn}>
        <Text style={styles.resumeBtnText}>Resume</Text>
      </View>
    </View>
  </Pressable>
)

// ── Dashboard tool card ─────────────────────────────────
const ToolCard = ({ icon, label, soon }: { icon: string, label: string, soon?: boolean }) => (
  <View style={styles.toolCard}>
    <Text style={styles.toolIcon}>{icon}</Text>
    <Text style={styles.toolLabel}>{label}</Text>
    {soon && (
      <View style={styles.soonBadge}>
        <Text style={styles.soonText}>Soon</Text>
      </View>
    )}
  </View>
)

// ── HomeScreen ──────────────────────────────────────────
export default function HomeScreen() {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const uid = auth.currentUser?.uid ?? ''

  // state
  const [userData, setUserData] = useState<any>(null)
  const [subjectList, setSubjectList] = useState<FirestoreSubject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('📚')
  const [nameError, setNameError] = useState('')

  // real-time user data listener
  useEffect(() => {
    if (!uid) return
    const ref = doc(db, 'users', uid)
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) setUserData(snap.data())
    })
    return () => unsubscribe()
  }, [uid])

  // load subjects once on mount
  useEffect(() => {
    if (!uid) return
    const load = async () => {
      const subs = await getSubjects(uid)
      setSubjectList(subs)
      setLoadingSubjects(false)
    }
    load()
  }, [uid])

  const getGreeting = () => {
    const time = new Date().getHours()
    if (time < 12) return 'Good Morning 👋'
    if (time < 18) return 'Good Afternoon 🌞'
    return 'Good Evening 🌙'
  }

  const handleAddSubject = async () => {
    if (subjectName.trim().length < 2) {
      setNameError('Name must be at least 2 characters')
      return
    }
    setNameError('')
    await addSubject(uid, subjectName.trim(), selectedIcon)
    const updated = await getSubjects(uid)
    setSubjectList(updated)
    setSubjectName('')
    setSelectedIcon('📚')
    setModalVisible(false)
  }

  const handleDeleteSubject = async (subjectId: string) => {
    await deleteSubject(uid, subjectId)
    setSubjectList(prev => prev.filter(s => s.id !== subjectId))
  }

  const activeSessions = subjectList.filter(
    s => s.lastStudied && s.lastStudied !== 'Never'
  )

  const progressPercent = userData
    ? Math.min((userData.progress ?? 0) / (userData.dailyGoal ?? 10) * 100, 100)
    : 0

  // loading state
  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Fixed header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.username}>{userData.username}</Text>
        </View>
        <Pressable style={styles.streakBadge}>
          <Text style={styles.streakText}>
            🔥 {userData.streak ?? 0} days
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Goal card */}
        <View style={styles.goalCard}>
          <View style={styles.goalCardTop}>
            <Text style={styles.goalLabel}>TODAY'S GOAL</Text>
            <Text style={styles.goalCount}>
              {userData.progress ?? 0}/{userData.dailyGoal ?? 10}
            </Text>
          </View>
          <Text style={styles.goalText}>
            Complete {userData.dailyGoal ?? 10} study sessions
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[
              styles.progressBarFill,
              { width: `${progressPercent}%` }
            ]} />
          </View>
          <Text style={styles.progressLabel}>
            {progressPercent === 100 ? 'Goal complete! 🎉' : `${Math.round(progressPercent)}% done`}
          </Text>
        </View>

        {/* Subjects section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>YOUR SUBJECTS</Text>
            <Pressable onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle" size={26} color="#6C63FF" />
            </Pressable>
          </View>

          {loadingSubjects ? (
            <ActivityIndicator color="#6C63FF" style={{ marginTop: 8 }} />
          ) : (
            <FlatList
              horizontal
              data={subjectList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SubjectCard
                  item={item}
                  onDelete={() => handleDeleteSubject(item.id)}
                />
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
              ListEmptyComponent={
                <Pressable
                  style={styles.emptySubjects}
                  onPress={() => setModalVisible(true)}
                >
                  <Ionicons name="add-circle-outline" size={28} color="#555" />
                  <Text style={styles.emptyText}>Add your first subject</Text>
                </Pressable>
              }
            />
          )}
        </View>

        {/* Continue studying — only shows if any subject has been studied */}
        {activeSessions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>CONTINUE STUDYING</Text>
            </View>
            <FlatList
              scrollEnabled={false}
              data={activeSessions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ContinueStudy
                  item={item}
                  onPress={() => navigation.navigate('Home', {
                    screen: 'Subject',
                    params: { subject: item }
                  })}
                />
              )}
              contentContainerStyle={{ gap: 12 }}
            />
          </View>
        )}

        {/* Dashboard — tools placeholder */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TOOLS</Text>
          </View>
          <View style={styles.toolsGrid}>
            <ToolCard icon="🤖" label="AI Tutor" soon />
            <ToolCard icon="📄" label="PDF to Cards" soon />
            <ToolCard icon="🎮" label="Practice" soon />
            <ToolCard icon="📊" label="Stats" soon />
          </View>
        </View>

      </ScrollView>

      {/* Add subject modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>

            <Text style={styles.modalTitle}>Add Subject</Text>

            <Text style={styles.modalLabel}>Pick an icon</Text>
            <View style={styles.iconRow}>
              {['📚', '📐', '🧬', '🔢', '🎨', '🧪', '💻', '🌍', '🏛', '🎵'].map((emoji) => (
                <Pressable
                  key={emoji}
                  style={[
                    styles.iconOption,
                    selectedIcon === emoji && styles.iconSelected
                  ]}
                  onPress={() => setSelectedIcon(emoji)}
                >
                  <Text style={styles.iconEmoji}>{emoji}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.modalLabel}>Subject name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mathematics"
              placeholderTextColor="#555"
              value={subjectName}
              onChangeText={(text) => {
                setSubjectName(text)
                if (text.length >= 2) setNameError('')
              }}
              autoFocus
            />

            {nameError !== '' && (
              <Text style={styles.errorText}>{nameError}</Text>
            )}

            <Pressable style={styles.addButton} onPress={handleAddSubject}>
              <Text style={styles.addButtonText}>Add Subject</Text>
            </Pressable>

            <Pressable onPress={() => setModalVisible(false)}>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#0f0f0f',
    borderBottomWidth: 0.5,
    borderBottomColor: '#1a1a1a',
  },
  greeting: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 2,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  streakBadge: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a4e',
  },
  streakText: {
    color: '#6C63FF',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    gap: 28,
    paddingBottom: 40,
  },
  goalCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  goalCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C63FF',
    letterSpacing: 1,
  },
  goalCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C63FF',
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#2a2a3e',
    borderRadius: 3,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#6C63FF',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    color: '#888888',
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666666',
    letterSpacing: 1.5,
  },
  emptySubjects: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#222235',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#555555',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222235',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardMeta: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  resumeBtn: {
    backgroundColor: '#6C63FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resumeBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#222235',
  },
  toolIcon: {
    fontSize: 28,
  },
  toolLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#aaaaaa',
  },
  soonBadge: {
    backgroundColor: '#2a2a3e',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  soonText: {
    fontSize: 10,
    color: '#6C63FF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#141420',
    borderRadius: 20,
    padding: 24,
    width: '88%',
    gap: 12,
    borderWidth: 1,
    borderColor: '#1e1e30',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalLabel: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '700',
    letterSpacing: 1,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconOption: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: '#222222',
  },
  iconSelected: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  iconEmoji: {
    fontSize: 22,
  },
  input: {
    backgroundColor: '#0f0f0f',
    borderRadius: 10,
    padding: 14,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#222222',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 13,
  },
  addButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelText: {
    color: '#555555',
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 4,
  },
})
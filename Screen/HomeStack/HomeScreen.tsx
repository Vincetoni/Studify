import { View, Text, StyleSheet, ScrollView, FlatList, Pressable, Modal, TextInput } from 'react-native'
import { subjects } from '../../Data/Subjects'
import type { Subject } from '../../Data/Subjects'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { Ionicons } from "@expo/vector-icons"
import  SubjectCard  from '../subjectCard'
import { auth } from '../../firebaseConfig'
import { getUserData } from '../../Service/userService'



  

const ContinueStudy = ({item}: {item: Subject}) => (
     <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
                <Text style={styles.goalText}>
                  {item.isStudying ? `${item.name} — Chapter ${item.chapters}` : '' } 
                </Text>
                <Text style={styles.progressLabel}>Last session: {item.lastStudied}</Text>
            </View>
            <View>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Resume</Text>
            </Pressable>
            </View>
        </View>
     </View>
)

    

// ✅ HomeScreen is the main screen
export default function HomeScreen() {
  const [ userData, setUserData ] = useState<any>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('📚')
  const [subjectList, setSubjectList] = useState(subjects)

  useEffect(() =>{
    const loadUser = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const data = await getUserData(uid);
      setUserData(data);
    }

    loadUser();
  },[]);
  
  if (!userData) {
    return <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center', color: '#fff' }}>Loading...</Text>
  }

  const deleteSubject = (id: string) => {
    setSubjectList(prev => prev.filter(item => item.id !== id))
  }

  const addSubject = () => {
    
    const newSubject: Subject = {
      id: Date.now().toString(), // unique id from timestamp
      name: subjectName,
      icon: selectedIcon,
      cardCount: 0,
      lastStudied: 'Never',
      isStudying: false,
      chapters: 0,
    }

    setSubjectList(prev => [...prev, newSubject]) // add to existing list
    setSubjectName('') // clear input
    setSelectedIcon('📚') // reset icon
    setModalVisible(false) // close modal
    // setNameError('')
  }

  const activeSessions = subjectList.filter(item => item.isStudying)
  const insets = useSafeAreaInsets()

  const getGreeting = () => {
    const time = new Date().getHours()
    if (time < 12) return 'Good Morning 👋'
    if (time < 18) return 'Good Afternoon 🌞'
    return 'Good Evening 🌙'
  }
  const navigation = useNavigation<any>()

  return ( 
    <View style={styles.container}>

    {/* Fixed header */}
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.username}>{userData.username}</Text>
      </View>
      <View style={styles.streakBadge}>
        <Text style={styles.streakText}>🔥 7 days</Text>
      </View>
    </View>

    {/* Scrollable body */}
    <ScrollView contentContainerStyle={styles.content}>

      <View style={styles.goalCard}>
        <Text style={styles.goalLabel}>{userData.username}'s GOAL</Text>
        <Text style={styles.goalText}>Complete {userData.dailyGoal} Sessions</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${userData.progress}%` }]} />
        </View>
        <Text style={styles.progressLabel}>1 of 2 Completed</Text>
      </View>


      <View style={styles.subjectsSection}>
     <View style={styles.subjectsSection}>
       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
       <Text style={styles.subjectHeader}>YOUR SUBJECTS</Text>
       <Pressable onPress={() => setModalVisible(true)}>
       <Ionicons name="add-circle" size={28} color="#6C63FF" />
       </Pressable>
     </View>  
   </View>
        <FlatList
          horizontal
          data={subjectList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubjectCard item={item} onDelete={() => deleteSubject(item.id)} />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16 }}
        />
      </View>

      <View style={styles.subjectsSection}>
        <Text style={styles.subjectHeader}>CONTINUE STUDYING</Text>
        <FlatList
          scrollEnabled={false}
          data={activeSessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ContinueStudy item={item} />}
          contentContainerStyle={{ gap: 16 }}
        />
      </View>

    </ScrollView>
    <Modal
  visible={modalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setModalVisible(false)}
>
  {/* Dark overlay */}
  <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>

    {/* Modal card — stop press from closing when tapping inside */}
    <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>

      <Text style={styles.modalTitle}>Add Subject</Text>

      {/* Icon picker */}
      <Text style={styles.modalLabel}>Pick an icon</Text>
      <View style={styles.iconRow}>
        {['📚', '📐', '🧬', '🔢', '🎨', '🧪', '💻', '🌍'].map((emoji) => (
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

      {/* Text input */}
      <Text style={styles.modalLabel}>Subject name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Mathematics"
        placeholderTextColor="#555"
        value={subjectName}
        onChangeText={(text) => {
         setSubjectName(text)
          // if (text.length >= 2) setNameError('') // clear error as they type
        }}
        autoFocus
      />
      {/* {nameError !== '' && (
        <Text style={styles.errorText}>{nameError}</Text>
      )} */}

      {/* Buttons */}
      <Pressable style={styles.addButton} onPress={addSubject}>
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
  content: {
    padding: 20,
    paddingTop: 20,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#0f0f0f',
  },
  greeting: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 2,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  streakBadge: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  streakText: {
    color: '#6C63FF',
    fontSize: 13,
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  goalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6C63FF',
    letterSpacing: 1,
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
  subjectsSection: {
    gap: 12,
  },
  subjectHeader: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
  },
  subjectCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    alignItems: 'center',
    width: 120,
    padding: 20,
    gap: 5,
  },
  subjectIcon: {
    fontSize: 28,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  subjectLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888888',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  overlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.7)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalCard: {
  backgroundColor: '#1a1a2e',
  borderRadius: 20,
  padding: 24,
  width: '85%',
  gap: 12,
},
modalTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#ffffff',
  marginBottom: 4,
},
modalLabel: {
  fontSize: 12,
  color: '#888888',
  fontWeight: '600',
  letterSpacing: 1,
},
iconRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
},
iconOption: {
  padding: 8,
  borderRadius: 10,
  backgroundColor: '#0f0f0f',
},
iconSelected: {
  backgroundColor: '#6C63FF',
},
iconEmoji: {
  fontSize: 24,
},
input: {
  backgroundColor: '#0f0f0f',
  borderRadius: 10,
  padding: 14,
  color: '#ffffff',
  fontSize: 16,
},
addButton: {
  backgroundColor: '#6C63FF',
  borderRadius: 12,
  padding: 16,
  alignItems: 'center',
  marginTop: 4,
},
addButtonText: {
  color: '#ffffff',
  fontSize: 16,
  fontWeight: '600',
},
cancelText: {
  color: '#888888',
  textAlign: 'center',
  fontSize: 14,
},
errorText: {
  color: '#ff3333',
  fontSize: 14,
  marginTop: -4,
},
})

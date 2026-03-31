import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebaseConfig'
import { getUserData } from '../../Service/userService'

const SUBJECTS = ['📐 Math', '🧬 Biology', '🧪 Chemistry', '💻 Computer Science', '🌍 Geography', '📖 Literature', '🔢 Physics', '🎨 Art']
const GOALS = [5, 10, 20, 30]
const STUDY_TIMES = ['🌅 Morning', '🌞 Afternoon', '🌙 Night', '⏱ Flexible']
const STUDY_STYLES = ['⚡ Quick sessions', '🧠 Deep focus', '🎮 Gamified', '📖 Chill learning']

export default function OnBoardingScreen() {
  const [ userData, setUserData ] = useState<any>(null)
  const navigation = useNavigation<any>()
  const route = useRoute<any>()

  const uid = auth.currentUser?.uid ?? ''
  const username = auth.currentUser?.displayName ?? userData?.username

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [dailyGoal, setDailyGoal] = useState(10)
  const [studyTime, setStudyTime] = useState('⏱ Flexible')
  const [studyStyle, setStudyStyle] = useState('⚡ Quick sessions')

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

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

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    )
  }

  const handleFinish = async () => {
    if (selectedSubjects.length === 0 || !uid) return

    setLoading(true)
    try {
      await updateDoc(doc(db, 'users', uid), {
        onboardingCompleted: true,
        selectedSubjects,
        dailyGoal,
        studyTime,
        studyStyle,
      })

      route.params?.onComplete?.()
    } catch (err: any) {
      console.log('Onboarding error:', err.message)
    } finally {
      setLoading(false)
    }
  }

  // STEP 1 — Welcome
  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>👋</Text>
        <Text style={styles.title}>Welcome, {username}!</Text>
        <Text style={styles.subtitle}>Let's set up your Studify experience in just a few steps</Text>
        <Pressable style={styles.button} onPress={() => setStep(2)}>
          <Text style={styles.buttonText}>Get started</Text>
        </Pressable>
      </View>
    )
  }

  // STEP 2 — Subjects
  if (step === 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>What do you study?</Text>
        <Text style={styles.subtitle}>Pick all that apply</Text>

        <View style={styles.subjectGrid}>
          {SUBJECTS.map(subject => (
            <Pressable
              key={subject}
              style={[
                styles.subjectChip,
                selectedSubjects.includes(subject) && styles.subjectChipSelected
              ]}
              onPress={() => toggleSubject(subject)}
            >
              <Text style={[
                styles.subjectChipText,
                selectedSubjects.includes(subject) && styles.subjectChipTextSelected
              ]}>
                {subject}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={[styles.button, selectedSubjects.length === 0 && styles.buttonDisabled]}
          onPress={() => setStep(3)}
        >
          <Text style={styles.buttonText}>
            Continue ({selectedSubjects.length})
          </Text>
        </Pressable>
      </View>
    )
  }

  // STEP 3 — Daily Goal
  if (step === 3) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Set your daily goal</Text>
        <Text style={styles.subtitle}>How many cards per day?</Text>

        <View style={styles.goalGrid}>
          {GOALS.map(goal => (
            <Pressable
              key={goal}
              style={[
                styles.goalChip,
                dailyGoal === goal && styles.goalChipSelected
              ]}
              onPress={() => setDailyGoal(goal)}
            >
              <Text style={[
                styles.goalNumber,
                dailyGoal === goal && styles.goalNumberSelected
              ]}>
                {goal}
              </Text>
              <Text style={[
                styles.goalLabel,
                dailyGoal === goal && styles.goalLabelSelected
              ]}>
                cards/day
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.button} onPress={() => setStep(4)}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    )
  }

  // STEP 4 — Study Time
  if (step === 4) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>When do you study best?</Text>
        <Text style={styles.subtitle}>We’ll optimize reminders</Text>

        <View style={styles.goalGrid}>
          {STUDY_TIMES.map(time => (
            <Pressable
              key={time}
              style={[
                styles.goalChip,
                studyTime === time && styles.goalChipSelected
              ]}
              onPress={() => setStudyTime(time)}
            >
              <Text style={[
                styles.goalLabel,
                studyTime === time && styles.goalLabelSelected
              ]}>
                {time}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.button} onPress={() => setStep(5)}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    )
  }

  // STEP 5 — Study Style (FINAL)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How do you like to learn?</Text>
      <Text style={styles.subtitle}>We’ll tailor your experience</Text>

      <View style={styles.subjectGrid}>
        {STUDY_STYLES.map(style => (
          <Pressable
            key={style}
            style={[
              styles.subjectChip,
              studyStyle === style && styles.subjectChipSelected
            ]}
            onPress={() => setStudyStyle(style)}
          >
            <Text style={[
              styles.subjectChipText,
              studyStyle === style && styles.subjectChipTextSelected
            ]}>
              {style}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 24 }} />
      ) : (
        <Pressable style={styles.button} onPress={handleFinish}>
          <Text style={styles.buttonText}>Let's go 🚀</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  scrollContent: {
    padding: 32,
    gap: 16,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 22,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginVertical: 8,
  },
  subjectChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#1a1a2e',
  },
  subjectChipSelected: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  subjectChipText: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '600',
  },
  subjectChipTextSelected: {
    color: '#ffffff',
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    marginVertical: 16,
  },
  goalChip: {
    width: 120,
    height: 100,
    borderRadius: 16,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  goalChipSelected: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  goalNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#888888',
  },
  goalNumberSelected: {
    color: '#ffffff',
  },
  goalLabel: {
    fontSize: 12,
    color: '#555555',
  },
  goalLabelSelected: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#333333',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
})
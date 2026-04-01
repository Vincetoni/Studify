import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import type { FirestoreSubject } from '../Service/subjectService'

const SubjectCard = ({ item, onDelete }: {
  item: FirestoreSubject
  onDelete: () => void
}) => {
  const navigation = useNavigation<any>()
  

  return (
    <Pressable
      style={styles.subjectCard}
      onPress={() => navigation.navigate('Home', {
        screen: 'Subject', params: { subject: item }
      })}
    >
      <Pressable onPress={onDelete} style={styles.removeBtn}>
        <Ionicons name="close-circle" size={18} color="#ff4444" />
      </Pressable>

      <Text style={styles.subjectIcon}>{item.icon}</Text>
      <Text style={styles.subjectName}>{item.name}</Text>
      <Text style={styles.subjectLabel}>{item.cardCount} cards</Text>
    </Pressable>
  )
}

export default SubjectCard

const styles = StyleSheet.create({
  subjectCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    alignItems: 'center',
    width: 120,
    padding: 20,
    gap: 5,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
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
})
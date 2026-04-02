import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import type { FirestoreSubject } from '../../Service/subjectService';

export default function SubjectScreen({ route }: any) {
  const { subject } = route.params as { subject: FirestoreSubject };
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // placeholder cards — will be replaced by Firestore subcollection in Phase 3
  const placeholderCards = [
    {
      id: '1',
      question: 'What is the first concept in ' + subject.name + '?',
      answer: 'Coming soon — add cards with AI in Phase 3',
    },
    {
      id: '2',
      question: 'What is the second concept in ' + subject.name + '?',
      answer: 'Coming soon — add cards with AI in Phase 3',
    },
    {
      id: '3',
      question: 'What is the third concept in ' + subject.name + '?',
      answer: 'Coming soon — add cards with AI in Phase 3',
    },
    {
      id: '4',
      question: 'What is the forth concept in ' + subject.name + '?',
      answer: 'Coming soon — add cards with AI in Phase 3',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>{subject.name}</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Subject info */}
      <View style={styles.subjectInfo}>
        <Text style={styles.icon}>{subject.icon}</Text>
        <Text style={styles.name}>{subject.name}</Text>
        <View style={styles.statRow}>
          <View style={styles.statBadge}>
            <Ionicons name="albums-outline" size={14} color="#6C63FF" />
            <Text style={styles.statText}>{subject.cardCount} cards</Text>
          </View>
          <View style={styles.statBadge}>
            <Ionicons name="time-outline" size={14} color="#6C63FF" />
            <Text style={styles.statText}>
              {subject.lastStudied === 'Never'
                ? 'Not studied yet'
                : subject.lastStudied}
            </Text>
          </View>
        </View>
      </View>

      {/* Cards list */}
      <FlatList
        data={placeholderCards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.listHeader}>FLASHCARDS</Text>}
        renderItem={({ item, index }) => (
          <View style={styles.cardPreview}>
            <Text style={styles.cardNumber}>Card {index + 1}</Text>
            <Text style={styles.cardQuestion}>{item.question}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>No cards yet</Text>
            <Text style={styles.emptySubtext}>
              Add cards manually or use AI in Phase 3
            </Text>
          </View>
        }
      />

      {/* Bottom buttons */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          label="Study Now 🚀"
          onPress={() =>
            navigation.navigate('StudyMode', {
              subject,
              cards: placeholderCards,
            })
          }
          fullWidth
        />
        <Button
          label="Add Cards (coming soon)"
          onPress={() => {}}
          variant="ghost"
          fullWidth
        />
      </View>
    </View>
  );
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  subjectInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  icon: {
    fontSize: 72,
  },
  name: {
    fontSize: 26,
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
    gap: 10,
    paddingBottom: 20,
  },
  listHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#555555',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  cardPreview: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#222235',
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
    lineHeight: 22,
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
    gap: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#1a1a1a',
  },
});

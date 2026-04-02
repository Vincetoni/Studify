import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStudyPal } from '../components/hooks/useStudyPal';
import StudyPalCard from '../components/ui/StudyPalCard';

export default function StudyScreen() {
  const insets = useSafeAreaInsets();
  const { pal, message } = useStudyPal();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <Text style={styles.title}>Study</Text>
      <Text style={styles.subtitle}>Practice modes coming in Phase 3</Text>
      <StudyPalCard pal={pal} message={message} />

      <View style={styles.grid}>
        {[
          { icon: '🎮', label: 'Quiz Mode', sub: 'Test your knowledge' },
          { icon: '⚡', label: 'Speed Round', sub: 'Race against time' },
          { icon: '🔁', label: 'Spaced Repetition', sub: 'Smart scheduling' },
          { icon: '🤖', label: 'AI Practice', sub: 'Adaptive questions' },
        ].map((item) => (
          <View key={item.label} style={styles.modeCard}>
            <Text style={styles.modeIcon}>{item.icon}</Text>
            <Text style={styles.modeLabel}>{item.label}</Text>
            <Text style={styles.modeSub}>{item.sub}</Text>
            <View style={styles.soonBadge}>
              <Text style={styles.soonText}>Phase 3</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  modeCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    width: '47%',
    gap: 6,
    borderWidth: 1,
    borderColor: '#222235',
  },
  modeIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  modeLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  modeSub: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  soonBadge: {
    backgroundColor: '#2a2a3e',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  soonText: {
    fontSize: 10,
    color: '#6C63FF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

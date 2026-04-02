import { View, Text, StyleSheet } from 'react-native';

export default function StudyPalCard({ pal, message }: any) {
  if (!pal) return null;

  return (
    <View style={Styles.card}>
      <Text style={Styles.emoji}>{pal.emoji}</Text>
      <View>
        <Text style={Styles.name}>{pal.name}</Text>
        <Text style={Styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const Styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    gap: 12,
  },
  emoji: {
    fontSize: 32,
  },
  name: {
    color: '#fff',
    fontWeight: '700',
  },
  message: {
    color: '#aaa',
  },
});

import { View, Text, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ProcessingScreen() {
  const [message, setMessage] = useState('Setting up your experience...');
  const [emoji, setEmoji] = useState('📚');
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  useEffect(() => {
    const runSetup = async () => {
      await new Promise((r) => setTimeout(r, 1000));
      setMessage('Analysing your study habits...');
      setEmoji('🔍');

      await new Promise((r) => setTimeout(r, 1000));
      setMessage('Assigning your Study Pal...');
      setEmoji('🐺');

      await new Promise((r) => setTimeout(r, 1200));
      setMessage('Almost ready...');
      setEmoji('🚀');

      await new Promise((r) => setTimeout(r, 1000));

      // trigger onComplete which updates onboardingCompleted in app.tsx
      route.params?.onComplete?.();
    };

    runSetup();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f0f0f',
        gap: 20,
      }}
    >
      <Text style={{ fontSize: 48 }}>{emoji}</Text>
      <ActivityIndicator size="large" color="#6C63FF" />
      <Text
        style={{
          color: '#ffffff',
          fontSize: 16,
          fontWeight: '600',
          marginTop: 8,
        }}
      >
        {message}
      </Text>
      <Text style={{ color: '#555555', fontSize: 13 }}>
        Studify is getting ready for you
      </Text>
    </View>
  );
}

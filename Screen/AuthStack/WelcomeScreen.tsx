import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

type AuthStackParamList = {
  Welcome: undefined
  Signup: undefined
  Login: undefined
  OnBoarding: { uid: string; username: string }
}

type WelcomeNavProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeNavProp>()
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>

      {/* Top section — branding */}
      <View style={styles.top}>
        <View style={styles.logoMark}>
          <Text style={styles.logoEmoji}>📚</Text>
        </View>
        <Text style={styles.appName}>Studify</Text>
        <Text style={styles.tagline}>Study smart, not hard</Text>
      </View>

      {/* Middle section — feature highlights */}
      <View style={styles.features}>
        <Feature icon="flash-outline" text="Smart flashcards that adapt to you" />
        <Feature icon="trending-up-outline" text="Track your progress every session" />
        <Feature icon="time-outline" text="Study less, remember more" />
      </View>

      {/* Bottom section — buttons */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Signup')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Get started</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

// small reusable feature row
function Feature({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={20} color="#6C63FF" />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },

  // top
  top: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 12,
  },
  logoMark: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#2a2a4e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 44,
  },
  appName: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: '#666666',
    letterSpacing: 0.3,
  },

  // features
  features: {
    gap: 16,
    paddingHorizontal: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#2a2a4e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 15,
    color: '#aaaaaa',
    flex: 1,
    lineHeight: 22,
  },

  // bottom
  bottom: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222235',
  },
  secondaryButtonText: {
    color: '#6C63FF',
    fontSize: 15,
    fontWeight: '600',
  },
})
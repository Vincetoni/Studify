import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as SystemUI from 'expo-system-ui';
SystemUI.setBackgroundColorAsync('#000000');
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, Button } from 'react-native';
import { auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

import StudyScreen from './Screen/StudyScreen';
import ProfileScreen from './Screen/ProfileScreen';
import HomeScreen from './Screen/HomeStack/HomeScreen';
import SubjectScreen from './Screen/HomeStack/SubjectScreen';
import StudyModeScreen from './Screen/HomeStack/StudyModeScreen';
import SignupScreen from './Screen/AuthStack/SignupScreen';
import LoginScreen from './Screen/AuthStack/LoginScreen';
import OnBoardingScreen from './Screen/AuthStack/onBoardingScreen';
import WelcomeScreen from './Screen/AuthStack/WelcomeScreen';
import ProcessingScreen from './Screen/AuthStack/ProcessingScreen';

type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: {
    uid: string;
    username: string;
    onComplete?: () => void;
  };
  Processing: undefined;
  MissingData: undefined;
};

type AuthStackParamList = {
  Welcome: undefined;
  Signup: undefined;
  Login: undefined;
  Processing: undefined;
  OnBoarding: {
    uid: string;
    username: string;
  };
};

type HomeStackParamList = {
  HomeMain: undefined;
  Subject: undefined;
  StudyMode: undefined;
  Login: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator();

function AppHomeStack() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0f0f0f' },
        animation: 'fade',
      }}
    >
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Subject" component={SubjectScreen}
       options={{
          tabBarStyle: { display: 'none' } // This hides the entire bottom tab bar
           }} 
        />
      <HomeStack.Screen name="StudyMode" component={StudyModeScreen} />
    </HomeStack.Navigator>
  );
}

function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: '#0f0f0f', borderTopWidth: 0 },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#555555',
        headerShown: false,
        sceneStyle: { backgroundColor: '#0f0f0f' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Study') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={AppHomeStack} />
      <Tab.Screen name="Study" component={StudyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStackScreen() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0f0f0f' },
      }}
    >
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="OnBoarding" component={OnBoardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Processing" component={ProcessingScreen} />
    </AuthStack.Navigator>
  );
}

// 🔥 NEW: Emergency logout screen for missing user data
function MissingDataScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f0f0f',
      }}
    >
      <Text style={{ color: 'white', fontSize: 18, marginBottom: 20 }}>
        User data not found. Please login again.
      </Text>
      <Button title="Logout" onPress={() => signOut(auth)} color="#6C63FF" />
    </View>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [hasUserData, setHasUserData] = useState(false); // 🔥 NEW
  const [checkTrigger, setCheckTrigger] = useState(0);

  if (__DEV__) {
    console.log('Auth state:', auth.currentUser?.uid);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // user is logged in — check their Firestore doc
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setOnboardingCompleted(data.onboardingCompleted ?? false);
            setHasUserData(true); // 🔥 NEW: mark that we have data
          } else {
            // 🔥 NEW: User auth exists but NO Firestore data (you deleted it!)
            console.log(
              'User auth exists but Firestore doc missing - forcing re-onboarding',
            );
            setHasUserData(false);
            setOnboardingCompleted(false);
            // Optional: Auto-logout after 3 seconds or show emergency screen
          }
        } catch (err) {
          console.log('Error fetching user doc:', err);
          setHasUserData(false);
        }
      } else {
        setHasUserData(false);
        setOnboardingCompleted(false);
      }
      setUser(authUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0f0f0f',
        }}
      >
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          !hasUserData ? (
            // 🔥 NEW: Auth exists but no Firestore data - show emergency logout
            <RootStack.Screen
              name="MissingData"
              component={MissingDataScreen}
            />
          ) : onboardingCompleted ? (
            // ✅ existing user who finished onboarding
            <RootStack.Screen name="Main" component={MainTab} />
          ) : (
            <>
              <RootStack.Screen
                name="Onboarding"
                component={OnBoardingScreen}
                initialParams={{
                  uid: user.uid, // 🔥 NEW: pass uid to onboarding
                  username: user.displayName || '', // 🔥 NEW: pass username
                  onComplete: () => {
                    setOnboardingCompleted(true);
                    setHasUserData(true);
                  },
                }}
              />
              <RootStack.Screen
                name="Processing"
                component={ProcessingScreen}
              />
            </>
          )
        ) : (
          // ✅ not logged in
          <RootStack.Screen name="Auth" component={AuthStackScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

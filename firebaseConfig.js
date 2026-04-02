import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB0xGXR74fvai59qKlUgi_vMpaSxI2rPiM',
  authDomain: 'studify-01.firebaseapp.com',
  projectId: 'studify-01',
  storageBucket: 'studify-01.firebasestorage.app',
  messagingSenderId: '488576409680',
  appId: '1:488576409680:web:dfa9b7eac2ffc15aa5b155',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);

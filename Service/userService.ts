import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// real-time listener version
export const listenToUserData = (
  uid: string,
  callback: (data: any) => void,
) => {
  const ref = doc(db, 'users', uid);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback(snap.data());
  });
};

// keep getDoc version for one-time fetches
export const getUserData = async (uid: string) => {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

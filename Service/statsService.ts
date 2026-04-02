import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

export const updateStreak = async (uid: string) => {
  try {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();
    const lastStudied = data.lastStudiedDate?.toDate?.() ?? null;
    const today = new Date();

    const todayMidnight = new Date(today.setHours(0, 0, 0, 0));
    const yesterdayMidnight = new Date(todayMidnight);
    yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);

    let newStreak = data.streak ?? 0;

    if (!lastStudied) {
      newStreak = 1;
    } else {
      const lastMidnight = new Date(lastStudied.setHours(0, 0, 0, 0));

      if (lastMidnight.getTime() === todayMidnight.getTime()) {
        newStreak = data.streak ?? 1;
      } else if (lastMidnight.getTime() === yesterdayMidnight.getTime()) {
        newStreak = (data.streak ?? 0) + 1;
      } else {
        newStreak = 1;
      }
    }

    await updateDoc(ref, {
      streak: newStreak,
      lastStudiedDate: new Date(),
    });

    return newStreak;
  } catch (err: any) {
    console.log('updateStreak error:', err.message);
  }
};

export const updateProgress = async (uid: string) => {
  try {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, {
      progress: increment(1), // increment by 1 each session
    });
  } catch (err: any) {
    console.log('updateProgress error:', err.message);
  }
};

export const resetDailyProgress = async (uid: string) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      progress: 0,
    });
  } catch (err: any) {
    console.log('resetDailyProgress error:', err.message);
  }
};

import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
  increment,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  createdAt?: any;
};

export const getFlashcards = async (
  uid: string,
  subjectId: string,
): Promise<Flashcard[]> => {
  try {
    const q = query(
      collection(db, 'users', uid, 'subjects', subjectId, 'flashcards'),
      orderBy('createdAt', 'asc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Flashcard[];
  } catch (err: any) {
    console.log('getFlashcards error:', err.message);
    return [];
  }
};

export const addFlashcard = async (
  uid: string,
  subjectId: string,
  question: string,
  answer: string,
) => {
  try {
    await addDoc(
      collection(db, 'users', uid, 'subjects', subjectId, 'flashcards'),
      {
        question: question.trim(),
        answer: answer.trim(),
        createdAt: serverTimestamp(),
      },
    );
    await updateDoc(doc(db, 'users', uid, 'subjects', subjectId), {
      cardCount: increment(1),
    });
  } catch (err: any) {
    console.log('addFlashcard error:', err.message);
  }
};

export const deleteFlashcard = async (
  uid: string,
  subjectId: string,
  cardId: string,
) => {
  try {
    await deleteDoc(
      doc(db, 'users', uid, 'subjects', subjectId, 'flashcards', cardId),
    );
    await updateDoc(doc(db, 'users', uid, 'subjects', subjectId), {
      cardCount: increment(-1),
    });
  } catch (err: any) {
    console.log('deleFlashcards error:', err.message);
  }
};

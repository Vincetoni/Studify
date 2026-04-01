import { db } from '../firebaseConfig'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'

export type FirestoreSubject = {
  id: string
  name: string
  icon: string
  cardCount: number
  lastStudied: string
  createdAt: any
}

// get all subjects for a user
export const getSubjects = async (uid: string): Promise<FirestoreSubject[]> => {
  try {
    const q = query(
      collection(db, 'users', uid, 'subjects'),
      orderBy('createdAt', 'asc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as FirestoreSubject[]
  } catch (err: any) {
    console.log('Error getting subjects:', err.message)
    return []
  }
}

// add a new subject
export const addSubject = async (uid: string, name: string, icon: string) => {
  try {
    await addDoc(collection(db, 'users', uid, 'subjects'), {
      name,
      icon,
      cardCount: 0,
      lastStudied: 'Never',
      createdAt: serverTimestamp(),
    })
  } catch (err: any) {
    console.log('Error adding subject:', err.message)
  }
}

// delete a subject
export const deleteSubject = async (uid: string, subjectId: string) => {
  try {
    await deleteDoc(doc(db, 'users', uid, 'subjects', subjectId))
  } catch (err: any) {
    console.log('Error deleting subject:', err.message)
  }
}
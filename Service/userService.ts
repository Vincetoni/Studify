import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getUserData = async (uid:string) => {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);

    if(snap.exists()) {
        return snap.data();
    } else {
        return null;
    }
};
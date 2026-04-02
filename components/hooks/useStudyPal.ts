import { useEffect, useState } from 'react';
import { getUserData } from '../../Service/userService';
import { auth } from '../../firebaseConfig';
import { STUDY_PALS } from '../../Service/ai/studyPal';
import { getMessage } from '../../Service/ai/messages';

export const useStudyPal = () => {
  const [pal, setPal] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const user = (await getUserData(uid)) || 'unknown';

      if (user === 'unknown') return;

      const palKey = (user.studyPal || 'zippy').toLowerCase();
      const palData = STUDY_PALS[palKey];
      const progress = 0;

      setPal(palData);
      setMessage(getMessage(palData.name, progress));
    };

    load();
  }, []);

  return { pal, message };
};

import { useEffect } from 'react';
import { useVocab } from '../Context/VocabContext';

// Global shortcut hook for Shift+V+N to open vocab collection modal
export const useGlobalShortcut = () => {
  const { openModal } = useVocab();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Shift+V+N sequence
      if (e.shiftKey && (e.key === 'V' || e.key === 'v')) {
        // Wait for next keydown for N
        const onNext = (ev) => {
          if (ev.shiftKey && (ev.key === 'N' || ev.key === 'n')) {
            openModal();
            window.removeEventListener('keydown', onNext);
          } else if (!ev.shiftKey) {
            window.removeEventListener('keydown', onNext);
          }
        };
        window.addEventListener('keydown', onNext);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openModal]);
};

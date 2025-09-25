import React, { createContext, useContext, useState } from 'react';
import VocabCollectionModal from '../Components/user/VocabCollectionModal';

const VocabContext = createContext();

export const VocabProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <VocabContext.Provider value={{ openModal, closeModal }}>
      {children}
      <VocabCollectionModal open={showModal} onClose={closeModal} onSelectSet={() => {}} />
    </VocabContext.Provider>
  );
};

export const useVocab = () => {
  const context = useContext(VocabContext);
  if (!context) throw new Error('useVocab must be used within VocabProvider');
  return context;
};

import React, { useEffect, useState } from 'react';
import { loadCollections, createCollection, addWordsToCollection } from '../../Utils/vocabCollections';

const VocabCollectionModal = ({ open, onClose, onSelectSet }) => {
  const [collections, setCollections] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState('');
  const [newSetName, setNewSetName] = useState('');
  const [wordsInput, setWordsInput] = useState('');

  useEffect(() => {
    if (open) {
      setCollections(loadCollections());
    }
  }, [open]);

  const handleSave = () => {
    const words = wordsInput
      .split(',')
      .map((w) => w.trim())
      .filter(Boolean);

    if (selectedSetId === 'new') {
      if (!newSetName.trim()) return;
      const set = createCollection(newSetName.trim());
      addWordsToCollection(set.id, words);
      setCollections(loadCollections());
      onSelectSet(set.id);
    } else if (selectedSetId) {
      addWordsToCollection(selectedSetId, words);
      onSelectSet(selectedSetId);
    }

    setWordsInput('');
    setNewSetName('');
    setSelectedSetId('');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Words to Collection</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Input vocabulary */}
        <textarea
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
          rows={3}
          placeholder="Enter words, separated by commas"
          value={wordsInput}
          onChange={(e) => setWordsInput(e.target.value)}
        />

        {/* Dropdown select collection */}
        <select
          className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring focus:ring-blue-300"
          value={selectedSetId}
          onChange={(e) => setSelectedSetId(e.target.value)}
        >
          <option value="">-- Select Collection --</option>
          <option value="new">➕ New Collection</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.words.length})
            </option>
          ))}
        </select>

        {/* If New Collection selected, input name */}
        {selectedSetId === 'new' && (
          <input
            className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="New collection name"
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
          />
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!wordsInput.trim() || (!selectedSetId || (selectedSetId === 'new' && !newSetName.trim()))}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default VocabCollectionModal;

const STORAGE_KEY = 'vocab_collections';

export const loadCollections = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export const saveCollections = (collections) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections || []));
};

export const createCollection = (name) => {
  const collections = loadCollections();
  const id = String(Date.now());
  const newSet = { id, name: name?.trim() || `Set ${collections.length + 1}`, words: [] };
  collections.push(newSet);
  saveCollections(collections);
  return newSet;
};

export const addWordsToCollection = (setId, words) => {
  const collections = loadCollections();
  const idx = collections.findIndex(s => s.id === setId);
  if (idx === -1) throw new Error('Collection not found');
  const normalized = (words || [])
    .filter(w => typeof w === 'string')
    .map(w => w.trim())
    .filter(w => w.length > 0);
  const existing = new Set(collections[idx].words || []);
  normalized.forEach(w => existing.add(w));
  collections[idx].words = Array.from(existing);
  saveCollections(collections);
  return collections[idx];
};

export const getCollectionById = (setId) => {
  return loadCollections().find(s => s.id === setId) || null;
};

export const renameCollection = (setId, name) => {
  const collections = loadCollections();
  const idx = collections.findIndex(s => s.id === setId);
  if (idx === -1) throw new Error('Collection not found');
  collections[idx].name = name?.trim() || collections[idx].name;
  saveCollections(collections);
  return collections[idx];
};

export const deleteCollection = (setId) => {
  const collections = loadCollections().filter(s => s.id !== setId);
  saveCollections(collections);
};



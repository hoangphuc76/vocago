// services/exam/vocabQuiz.service.js
import { generateVocabularyQuestions } from './gemini.service.js';

export const generateVocabularyQuiz = async ({ words, questionsPerWord = 10, language = 'vi' }) => {
  if (!Array.isArray(words) || words.length === 0) {
    throw new Error('words must be a non-empty array of strings');
  }

  const normalizedWords = words
    .filter((w) => typeof w === 'string')
    .map((w) => w.trim())
    .filter((w) => w.length > 0);

  if (normalizedWords.length === 0) {
    throw new Error('words contains no valid entries');
  }

  const numQuestions = Number.isInteger(questionsPerWord) && questionsPerWord > 0
    ? questionsPerWord
    : 10;

  const lang = typeof language === 'string' && language.trim().length > 0
    ? language.trim()
    : 'vi';

  const result = await generateVocabularyQuestions(normalizedWords, numQuestions, lang);
  return result;
};



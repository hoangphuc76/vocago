import React, { useMemo, useState } from 'react';

const VocabCardQuiz = ({ data }) => {
  // Flatten questions to a single sequence of cards
  const cards = useMemo(() => {
    const out = [];
    data.forEach(({ word, questions }) => {
      questions.forEach((q) => out.push({ word, ...q }));
    });
    return out;
  }, [data]);

  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const current = cards[idx];

  const isLast = idx === cards.length - 1;
  const isCorrect = confirmed && chosen === current?.correct_index;
  const canNext = confirmed && (isLast || idx < cards.length - 1);

  const onChoose = (i) => {
    if (confirmed) return;
    setChosen(i);
  };

  const onConfirm = () => {
    if (chosen == null) return;
    setConfirmed(true);
  };

  const onNext = () => {
    if (!canNext) return;
    if (!isLast) {
      setIdx((v) => v + 1);
      setChosen(null);
      setConfirmed(false);
    }
  };

  if (!current) return null;

  return (
    <div className="max-w-2xl mx-auto border rounded-lg shadow-sm p-6 bg-white">
      <div className="text-sm text-gray-600 mb-2">Vocabulary: <b>{current.word}</b></div>
      <div className="text-lg font-semibold mb-3">{current.question}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
        {current.options.map((opt, i) => {
          const base = 'border rounded px-3 py-2 cursor-pointer';
          const isChosen = chosen === i;
          const state = confirmed
            ? (i === current.correct_index
                ? 'border-green-600 bg-green-50'
                : (isChosen ? 'border-red-600 bg-red-50' : 'opacity-70'))
            : (isChosen ? 'border-blue-600 bg-blue-50' : 'hover:border-blue-400');
          return (
            <div key={i} className={`${base} ${state}`} onClick={() => onChoose(i)}>
              {String.fromCharCode(65 + i)}. {opt}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {!confirmed ? (
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" onClick={onConfirm} disabled={chosen==null}>Confirm</button>
        ) : (
          <div className={isCorrect ? 'text-green-700' : 'text-red-700'}>
            {isCorrect ? 'Correct!' : 'Incorrect.'}
          </div>
        )}
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors" disabled={!canNext} onClick={onNext}>
          {isLast ? 'Finish' : 'Next Question'}
        </button>
        <div className="ml-auto text-sm text-gray-600">{idx + 1} / {cards.length}</div>
      </div>
    </div>
  );
};

export default VocabCardQuiz;



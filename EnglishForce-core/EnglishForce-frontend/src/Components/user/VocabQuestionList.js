import React, { useState } from 'react';

const VocabQuestionList = ({ data }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChoose = (word, qIdx, optIdx) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [word]: { ...(prev[word] || {}), [qIdx]: optIdx }
    }));
  };

  const handleSubmit = () => setSubmitted(true);

  const calcScore = () => {
    let correct = 0, total = 0;
    data.forEach(({ word, questions }) => {
      questions.forEach((q, idx) => {
        total += 1;
        const chosen = answers[word]?.[idx];
        if (typeof chosen === 'number' && chosen === q.correct_index) correct += 1;
      });
    });
    return { correct, total };
  };

  const { correct, total } = calcScore();

  return (
    <div className="space-y-6">
      {data.map(({ word, questions }) => (
        <div key={word} className="border rounded p-4">
          <h2 className="font-bold text-lg mb-3">Từ vựng: {word}</h2>
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={idx} className="">
                <div className="font-medium mb-2">{idx + 1}. {q.question}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => {
                    const chosen = answers[word]?.[idx];
                    const isChosen = chosen === oIdx;
                    const isCorrect = submitted && q.correct_index === oIdx;
                    const isWrongChosen = submitted && isChosen && !isCorrect;
                    const base = 'border rounded px-3 py-2 cursor-pointer';
                    const state = submitted
                      ? isCorrect
                        ? 'border-green-600 bg-green-50'
                        : isWrongChosen
                          ? 'border-red-600 bg-red-50'
                          : 'opacity-75'
                      : isChosen
                        ? 'border-blue-600 bg-blue-50'
                        : 'hover:border-blue-400';
                    return (
                      <div
                        key={oIdx}
                        className={`${base} ${state}`}
                        onClick={() => handleChoose(word, idx, oIdx)}
                      >
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        {!submitted ? (
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition-colors">Submit</button>
        ) : (
          <div className="font-semibold">Result: {correct}/{total} correct</div>
        )}
      </div>
    </div>
  );
};

export default VocabQuestionList;



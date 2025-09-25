import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VocabQuizTakingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizData, settings } = location.state || {};

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Flatten all questions into a single array
  const allQuestions = quizData?.vocabulary?.flatMap(({ word, questions }) =>
    questions.map(q => ({ ...q, word }))
  ) || [];

  const currentQuestion = allQuestions[currentCardIndex];
  const isLastCard = currentCardIndex === allQuestions.length - 1;

  useEffect(() => {
    if (!quizData) {
      navigate('/vocab-quiz');
    }
  }, [quizData, navigate]);

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correct_index;
    const newAnswer = {
      question: currentQuestion.question,
      word: currentQuestion.word,
      selectedAnswer,
      correctAnswer: currentQuestion.correct_index,
      isCorrect,
      options: currentQuestion.options
    };

    setAnswers(prev => [...prev, newAnswer]);
    setShowResult(true);

    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      if (isLastCard) {
        setIsCompleted(true);
        setShowCelebration(true);
      } else {
        setCurrentCardIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 1500);
  };

  const getScore = () => {
    const correct = answers.filter(a => a.isCorrect).length;
    const total = answers.length;
    return { correct, total, percentage: Math.round((correct / total) * 100) };
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return 'Excellent! 🎉';
    if (percentage >= 70) return 'Good job! 👍';
    if (percentage >= 50) return 'Keep improving! 💪';
    return 'Try harder! 🔥';
  };

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="text-center">
         <h2 className="text-xl font-semibold text-gray-900 mb-2">Quiz data not found</h2>
         <button
           onClick={() => navigate('/vocab-quiz')}
           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
         >
           Back to Quiz Creation
         </button>
       </div>
      </div>
    );
  }

  if (isCompleted) {
    const { correct, total, percentage } = getScore();
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* {showCelebration && (
          <div className="fixed inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-600 mb-2">Hoàn thành!</h2>
              <p className="text-lg text-gray-700">Chúc mừng bạn đã hoàn thành quiz!</p>
            </div>
          </div>
        )} */}
        
         <div className="max-w-4xl mx-auto px-4 py-8">
           <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
             <div className="text-center mb-8">
               <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
               <div className={`text-4xl font-bold ${getScoreColor(percentage)} mb-2`}>
                 {correct}/{total} ({percentage}%)
               </div>
               <p className="text-xl text-gray-600">{getScoreMessage(percentage)}</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                 <h3 className="font-semibold text-gray-900 mb-2">Detailed Statistics</h3>
                 <div className="space-y-2">
                   <div className="flex justify-between">
                     <span className="text-gray-600">Total Questions:</span>
                     <span className="font-medium">{total}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Correct Answers:</span>
                     <span className="font-medium text-green-600">{correct}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Incorrect Answers:</span>
                     <span className="font-medium text-red-600">{total - correct}</span>
                   </div>
                 </div>
               </div>

               <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                 <h3 className="font-semibold text-gray-900 mb-2">Quiz Settings</h3>
                 <div className="space-y-2">
                   <div className="flex justify-between">
                     <span className="text-gray-600">Language:</span>
                     <span className="font-medium">{settings?.language === 'vi' ? 'Vietnamese' : 'English'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Questions per word:</span>
                     <span className="font-medium">{settings?.questionsPerWord}</span>
                   </div>
                 </div>
               </div>
             </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Answer Details</h3>
              {answers.map((answer, index) => (
                <div key={index} className={`border rounded-lg p-4 ${answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Question {index + 1}:</span>
                    <span className="text-sm text-gray-600">({answer.word})</span>
                    {answer.isCorrect ? (
                      <span className="text-green-600 font-medium">✓ Correct</span>
                    ) : (
                      <span className="text-red-600 font-medium">✗ Incorrect</span>
                    )}
                  </div>
                  <p className="text-gray-800 mb-3">{answer.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {answer.options.map((option, optIndex) => {
                      const isSelected = optIndex === answer.selectedAnswer;
                      const isCorrect = optIndex === answer.correctAnswer;
                      const isWrongSelected = isSelected && !isCorrect;
                      
                      return (
                        <div
                          key={optIndex}
                          className={`p-2 rounded border ${
                            isCorrect
                              ? 'bg-green-100 border-green-300 text-green-800'
                              : isWrongSelected
                              ? 'bg-red-100 border-red-300 text-red-800'
                              : 'bg-gray-100 border-gray-300 text-gray-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

             <div className="flex flex-wrap gap-4 mt-8">
               <button
                 onClick={() => navigate('/vocab-quiz')}
                 className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
               >
                 Create New Quiz
               </button>
               <button
                 onClick={() => {
                   setCurrentCardIndex(0);
                   setSelectedAnswer(null);
                   setShowResult(false);
                   setAnswers([]);
                   setIsCompleted(false);
                   setShowCelebration(false);
                 }}
                 className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 transition-colors"
               >
                 Retake This Quiz
               </button>
               <button
                 onClick={() => navigate('/vocab-quiz')}
                 className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors"
               >
                 Back to Quiz Page
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress bar */}
         <div className="mb-8">
           <div className="flex justify-between items-center mb-2">
             <span className="text-sm font-medium text-gray-600">
               Question {currentCardIndex + 1} / {allQuestions.length}
             </span>
             <span className="text-sm text-gray-500">
               {Math.round(((currentCardIndex + 1) / allQuestions.length) * 100)}%
             </span>
           </div>
           <div className="w-full bg-gray-200 rounded-full h-2">
             <div
               className="bg-blue-600 h-2 rounded-full transition-all duration-300"
               style={{ width: `${((currentCardIndex + 1) / allQuestions.length) * 100}%` }}
             ></div>
           </div>
         </div>

        {/* Question card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 mb-2">Vocabulary: <span className="font-medium text-gray-900">{currentQuestion.word}</span></div>
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = showResult && index === currentQuestion.correct_index;
              const isWrong = showResult && isSelected && index !== currentQuestion.correct_index;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    showResult
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : isWrong
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                      : isSelected
                      ? 'border-gray-900 bg-gray-50 text-gray-900'
                      : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              );
            })}
          </div>

           {!showResult && (
             <div className="text-center">
               <button
                 onClick={handleConfirm}
                 disabled={selectedAnswer === null}
                 className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 Confirm
               </button>
             </div>
           )}

           {showResult && (
             <div className="text-center">
               <div className={`text-lg font-semibold mb-2 ${
                 selectedAnswer === currentQuestion.correct_index ? 'text-green-600' : 'text-red-600'
               }`}>
                 {selectedAnswer === currentQuestion.correct_index ? '✓ Correct!' : '✗ Incorrect!'}
               </div>
               <p className="text-gray-600">
                 {isLastCard ? 'Calculating results...' : 'Moving to next question...'}
               </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default VocabQuizTakingPage;

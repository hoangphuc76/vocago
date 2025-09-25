"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../../Api/axiosInstance"
import { loadCollections, getCollectionById } from "../../../Utils/vocabCollections"

const VocabQuizPage = () => {
  const navigate = useNavigate()
  const [collections, setCollections] = useState([])
  const [selectedSetId, setSelectedSetId] = useState("")
  const [questionsPerWord, setQuestionsPerWord] = useState(5)
  const [language, setLanguage] = useState("vi")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Load collections on mount and auto-refresh
  useEffect(() => {
    setCollections(loadCollections())
  }, [])

  // Auto-refresh collections when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setCollections(loadCollections())
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const handleGenerate = async () => {
    if (!selectedSetId) {
      setError("Please select a vocabulary collection")
      return
    }

    const selectedSet = getCollectionById(selectedSetId)
    if (!selectedSet || !selectedSet.words || selectedSet.words.length === 0) {
      setError("Collection has no vocabulary words")
      return
    }

    setLoading(true)
    setError("")
    try {
      const { data } = await axiosInstance.post("/exams/gemini/vocab-quiz", {
        words: selectedSet.words,
        questionsPerWord: Number(questionsPerWord) || 5,
        language,
      })
      
      // Navigate to quiz taking page with quiz data
      navigate('/vocab-quiz/taking', {
        state: {
          quizData: data,
          settings: {
            language,
            questionsPerWord: Number(questionsPerWord) || 5,
            collectionName: selectedSet.name
          }
        }
      })
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen ">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Vocabulary Quiz</h1>
          <p className="text-gray-600 text-sm">
            Press <kbd className="px-2 text-black py-1 bg-gray-100 rounded text-xs font-mono">Shift+V+N</kbd> to open vocabulary collection management modal
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Vocabulary Collection</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={selectedSetId}
                onChange={(e) => setSelectedSetId(e.target.value)}
              >
                <option value="">-- Select Collection --</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.words.length} words)
                  </option>
                ))}
              </select>
              {selectedSetId && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-xs font-medium text-blue-600 mb-1">Words in collection:</p>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {getCollectionById(selectedSetId)?.words?.join(", ")}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Questions per word</label>
              <input
                type="number"
                min={1}
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={questionsPerWord}
                onChange={(e) => setQuestionsPerWord(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="vi">Vietnamese</option>
                <option value="en">English</option>
              </select>
            </div>

            
          </div>
          <div className="flex">
              <div className="text-sm text-gray-600">
                <p>Quiz will be displayed as individual question cards</p>
                <p>You will answer each question and move to the next</p>
              </div>
            </div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={handleGenerate}
              disabled={loading || !selectedSetId}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Quiz"
              )}
            </button>
          </div>
        </div>

         {error && (
           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
             <div className="flex items-center gap-2">
               <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                 <path
                   fillRule="evenodd"
                   d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                   clipRule="evenodd"
                 />
               </svg>
               <p className="text-red-800 font-medium">{error}</p>
             </div>
           </div>
         )}
      </div>
    </div>
  )
}

export default VocabQuizPage


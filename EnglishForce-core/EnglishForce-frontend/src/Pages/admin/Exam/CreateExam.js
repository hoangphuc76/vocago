import React, { useState } from 'react';
import axiosInstance from '../../../Api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uploadToCloudinary } from '../../../Api/cloudinary';

const CreateExam = () => {
  const [exam, setExam] = useState({
    name: '',
    description: '',
    duration: 0,
    type: 'toeic',
    parts: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!exam.name.trim()) {
      newErrors.name = 'Exam name is required';
    }

    if (!exam.duration || exam.duration <= 0) {
      newErrors.duration = 'Duration must be a positive number';
    }

    if (!exam.type) {
      newErrors.type = 'Exam type is required';
    }

    // Validate parts structure
    if (!exam.parts || exam.parts.length === 0) {
      newErrors.parts = 'At least one section is required';
    } else {
      exam.parts.forEach((part, partIndex) => {
        if (!part.name) {
          newErrors[`part_${partIndex}_name`] = 'Section name is required';
        }

        // Validate questions in this part
        if (part.questions && part.questions.length > 0) {
          part.questions.forEach((question, questionIndex) => {
            if (!question.content && question.type !== 'multiple_choice') {
              newErrors[`part_${partIndex}_question_${questionIndex}_content`] = 'Question content is required';
            }

            if (!question.answers || question.answers.length === 0) {
              // WRITING and SPEAKING questions don't require predefined answers
              const isWritingOrSpeaking = question.type === 'writing' || question.type === 'speaking';
              if (!isWritingOrSpeaking) {
                newErrors[`part_${partIndex}_question_${questionIndex}_answers`] = 'At least one answer is required';
              }
            } else {
              const hasCorrectAnswer = question.answers.some(answer => answer.is_correct);
              // WRITING and SPEAKING questions don't require correct answers
              const isWritingOrSpeaking = question.type === 'writing' || question.type === 'speaking';
              if (!hasCorrectAnswer && !isWritingOrSpeaking) {
                newErrors[`part_${partIndex}_question_${questionIndex}_correct_answer`] = 'At least one correct answer is required';
              }
            }
          });
        }

        // Validate child parts
        if (part.parts && part.parts.length > 0) {
          part.parts.forEach((childPart, childPartIndex) => {
            if (!childPart.questions || childPart.questions.length === 0) {
              newErrors[`part_${partIndex}_child_${childPartIndex}_questions`] = 'At least one question is required';
            } else {
              childPart.questions.forEach((question, questionIndex) => {
                if (!question.content && question.type !== 'multiple_choice') {
                  newErrors[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_content`] = 'Question content is required';
                }

                if (!question.answers || question.answers.length === 0) {
                  newErrors[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_answers`] = 'At least one answer is required';
                } else {
                  const hasCorrectAnswer = question.answers.some(answer => answer.is_correct);
                  if (!hasCorrectAnswer) {
                    newErrors[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_correct_answer`] = 'At least one correct answer is required';
                  }
                }
              });
            }
          });
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExam({ ...exam, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePartChange = (partIndex, field, value) => {
    const parts = [...exam.parts];
    parts[partIndex][field] = value;
    setExam({ ...exam, parts });

    // Clear error when user starts typing
    if (errors[`part_${partIndex}_${field}`]) {
      setErrors({ ...errors, [`part_${partIndex}_${field}`]: '' });
    }
  };

  const handleQuestionChange = (partIndex, questionIndex, field, value, isChildPart = false, childPartIndex = null) => {
    const parts = [...exam.parts];

    if (isChildPart) {
      parts[partIndex].parts[childPartIndex].questions[questionIndex][field] = value;
    } else {
      parts[partIndex].questions[questionIndex][field] = value;
    }

    setExam({ ...exam, parts });
  };

  const handleAnswerChange = (partIndex, questionIndex, answerIndex, field, value, isChildPart = false, childPartIndex = null) => {
    const parts = [...exam.parts];

    if (isChildPart) {
      parts[partIndex].parts[childPartIndex].questions[questionIndex].answers[answerIndex][field] = value;
    } else {
      parts[partIndex].questions[questionIndex].answers[answerIndex][field] = value;
    }

    setExam({ ...exam, parts });
  };

  const handleFileUpload = async (partIndex, field, file, isChildPart = false, childPartIndex = null, isQuestion = false, questionIndex = null) => {
    if (!file) return;

    // Set uploading state for this specific field
    const uploadKey = isChildPart
      ? `part_${partIndex}_child_${childPartIndex}_${field}`
      : isQuestion
      ? `part_${partIndex}_question_${questionIndex}_${field}`
      : `part_${partIndex}_${field}`;

    setUploading(prev => ({ ...prev, [uploadKey]: true }));

    try {
      // Determine appropriate folder based on field type
      let folder = 'exams';
      if (field === 'thumbnail') {
        folder = isQuestion ? 'exams/questions' : 'exams/sections';
      } else if (field === 'record') {
        folder = isQuestion ? 'exams/questions/audio' : 'exams/sections/audio';
      }

      const url = await uploadToCloudinary(file, folder);

      // Update the appropriate field with the uploaded URL
      const parts = [...exam.parts];

      if (isChildPart) {
        if (isQuestion) {
          parts[partIndex].parts[childPartIndex].questions[questionIndex][field] = url;
        } else {
          parts[partIndex].parts[childPartIndex][field] = url;
        }
      } else {
        if (isQuestion) {
          parts[partIndex].questions[questionIndex][field] = url;
        } else {
          parts[partIndex][field] = url;
        }
      }

      setExam({ ...exam, parts });
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const addPart = () => {
    setExam({
      ...exam,
      parts: [
        ...exam.parts,
        {
          name: '',
          description: '',
          order_index: exam.parts.length,
          questions: [],
          parts: [] // For nested parts
        }
      ]
    });
  };

  const addChildPart = (partIndex) => {
    const parts = [...exam.parts];
    if (!parts[partIndex].parts) {
      parts[partIndex].parts = [];
    }

    parts[partIndex].parts.push({
      name: '',
      description: '',
      order_index: parts[partIndex].parts.length,
      questions: []
    });

    setExam({ ...exam, parts });
  };

  const addQuestion = (partIndex, isChildPart = false, childPartIndex = null) => {
    const parts = [...exam.parts];

    if (isChildPart) {
      if (!parts[partIndex].parts[childPartIndex].questions) {
        parts[partIndex].parts[childPartIndex].questions = [];
      }

      parts[partIndex].parts[childPartIndex].questions.push({
        content: '',
        type: 'single_choice',
        order_index: parts[partIndex].parts[childPartIndex].questions.length,
        answers: []
      });
    } else {
      if (!parts[partIndex].questions) {
        parts[partIndex].questions = [];
      }

      parts[partIndex].questions.push({
        content: '',
        type: 'single_choice',
        order_index: parts[partIndex].questions.length,
        answers: []
      });
    }

    setExam({ ...exam, parts });
  };

  const addAnswer = (partIndex, questionIndex, isChildPart = false, childPartIndex = null) => {
    const parts = [...exam.parts];

    if (isChildPart) {
      parts[partIndex].parts[childPartIndex].questions[questionIndex].answers.push({
        content: '',
        is_correct: false
      });
    } else {
      parts[partIndex].questions[questionIndex].answers.push({
        content: '',
        is_correct: false
      });
    }

    setExam({ ...exam, parts });
  };

  const removePart = (partIndex) => {
    const parts = [...exam.parts];
    parts.splice(partIndex, 1);
    // Reorder remaining parts
    const reorderedParts = parts.map((part, index) => ({
      ...part,
      order_index: index
    }));
    setExam({ ...exam, parts: reorderedParts });
  };

  const removeChildPart = (partIndex, childPartIndex) => {
    const parts = [...exam.parts];
    parts[partIndex].parts.splice(childPartIndex, 1);
    // Reorder remaining child parts
    const reorderedChildParts = parts[partIndex].parts.map((part, index) => ({
      ...part,
      order_index: index
    }));
    parts[partIndex].parts = reorderedChildParts;
    setExam({ ...exam, parts });
  };

  const removeQuestion = (partIndex, questionIndex, isChildPart = false, childPartIndex = null) => {
    const parts = [...exam.parts];

    if (isChildPart) {
      parts[partIndex].parts[childPartIndex].questions.splice(questionIndex, 1);
      // Reorder remaining questions
      const reorderedQuestions = parts[partIndex].parts[childPartIndex].questions.map((q, index) => ({
        ...q,
        order_index: index
      }));
      parts[partIndex].parts[childPartIndex].questions = reorderedQuestions;
    } else {
      parts[partIndex].questions.splice(questionIndex, 1);
      // Reorder remaining questions
      const reorderedQuestions = parts[partIndex].questions.map((q, index) => ({
        ...q,
        order_index: index
      }));
      parts[partIndex].questions = reorderedQuestions;
    }

    setExam({ ...exam, parts });
  };

  const removeAnswer = (partIndex, questionIndex, answerIndex, isChildPart = false, childPartIndex = null) => {
    const parts = [...exam.parts];

    if (isChildPart) {
      parts[partIndex].parts[childPartIndex].questions[questionIndex].answers.splice(answerIndex, 1);
    } else {
      parts[partIndex].questions[questionIndex].answers.splice(answerIndex, 1);
    }

    setExam({ ...exam, parts });
  };

  const setCorrectAnswer = (partIndex, questionIndex, answerIndex, isChildPart = false, childPartIndex = null) => {
    const parts = [...exam.parts];

    if (isChildPart) {
      // Set only this answer as correct, uncheck others
      parts[partIndex].parts[childPartIndex].questions[questionIndex].answers.forEach((answer, idx) => {
        answer.is_correct = idx === answerIndex;
      });
    } else {
      // Set only this answer as correct, uncheck others
      parts[partIndex].questions[questionIndex].answers.forEach((answer, idx) => {
        answer.is_correct = idx === answerIndex;
      });
    }

    setExam({ ...exam, parts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const response = await axiosInstance.post('/exams', exam);
      console.log('Exam created successfully:', response.data);
      toast.success('Exam created successfully!');
      setSuccess(true);
      // Reset form
      setExam({
        name: '',
        description: '',
        duration: 0,
        type: 'toeic',
        parts: [],
      });
    } catch (error) {
      console.error('Error creating exam:', error);
      toast.error('Failed to create exam. Please try again.');
      setErrors({ submit: 'Failed to create exam. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getExamStructureInfo = () => {
    switch (exam.type) {
      case 'toeic':
        return "TOEIC Structure: 2 main sections (Listening and Reading), each with multiple parts.";
      case 'ielts':
        return "IELTS Structure: 4 main sections (Listening, Reading, Writing, Speaking).";
      case 'toefl':
        return "TOEFL Structure: 4 main sections (Reading, Listening, Speaking, Writing).";
      default:
        return "General Exam Structure: Custom sections and parts.";
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Exam</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Exam Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Exam Name *
            </label>
            <input
              type="text"
              name="name"
              value={exam.name}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="Enter exam name"
            />
            {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Duration (minutes) *
            </label>
            <input
              type="number"
              name="duration"
              value={exam.duration}
              onChange={handleInputChange}
              min="1"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.duration ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="Enter duration in minutes"
            />
            {errors.duration && <p className="text-red-500 text-xs italic mt-1">{errors.duration}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Exam Type *
            </label>
            <select
              name="type"
              value={exam.type}
              onChange={handleInputChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.type ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
            >
              <option value="toeic">TOEIC</option>
              <option value="ielts">IELTS</option>
              <option value="toefl">TOEFL</option>
              <option value="general">General</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs italic mt-1">{errors.type}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={exam.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter exam description"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            <span className="font-semibold">Structure Info:</span> {getExamStructureInfo()}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Exam Sections</h2>
          <button
            type="button"
            onClick={addPart}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Section
          </button>
        </div>

        {exam.parts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No sections added yet. Click "Add Section" to start building your exam.
          </div>
        ) : (
          <div className="space-y-6">
            {exam.parts.map((part, partIndex) => (
              <div key={partIndex} className="border border-gray-200 rounded-lg p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Section {partIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removePart(partIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove Section
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Section Name *
                    </label>
                    <input
                      type="text"
                      value={part.name}
                      onChange={(e) => handlePartChange(partIndex, 'name', e.target.value)}
                      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors[`part_${partIndex}_name`] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                      }`}
                      placeholder="Enter section name"
                    />
                    {errors[`part_${partIndex}_name`] && <p className="text-red-500 text-xs italic mt-1">{errors[`part_${partIndex}_name`]}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Order Index
                    </label>
                    <input
                      type="number"
                      value={part.order_index}
                      onChange={(e) => handlePartChange(partIndex, 'order_index', parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Section Description
                    </label>
                    <textarea
                      value={part.description}
                      onChange={(e) => handlePartChange(partIndex, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Enter section description"
                      rows="2"
                    ></textarea>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Section Audio (Record)
                    </label>
                    <input
                      type="text"
                      value={part.record || ''}
                      onChange={(e) => handlePartChange(partIndex, 'record', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Enter audio URL (optional)"
                    />
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleFileUpload(partIndex, 'record', e.target.files[0])}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        disabled={uploading[`part_${partIndex}_record`]}
                      />
                      {uploading[`part_${partIndex}_record`] && (
                        <p className="text-blue-500 text-sm mt-1">Uploading audio...</p>
                      )}
                      {part.record && (
                        <div className="mt-2">
                          <audio controls className="w-full">
                            <source src={part.record} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Section Image (Thumbnail)
                    </label>
                    <input
                      type="text"
                      value={part.thumbnail || ''}
                      onChange={(e) => handlePartChange(partIndex, 'thumbnail', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Enter image URL (optional)"
                    />
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(partIndex, 'thumbnail', e.target.files[0])}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        disabled={uploading[`part_${partIndex}_thumbnail`]}
                      />
                      {uploading[`part_${partIndex}_thumbnail`] && (
                        <p className="text-blue-500 text-sm mt-1">Uploading image...</p>
                      )}
                      {part.thumbnail && (
                        <img
                          src={part.thumbnail}
                          alt="Thumbnail preview"
                          className="mt-2 max-w-xs h-auto rounded"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct questions under section (for simple structures) */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium text-gray-700">Direct Questions</h4>
                    <button
                      type="button"
                      onClick={() => addQuestion(partIndex)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                    >
                      Add Question
                    </button>
                  </div>

                  {part.questions && part.questions.length > 0 ? (
                    <div className="space-y-4">
                      {part.questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-gray-800">Question {questionIndex + 1}</h5>
                            <button
                              type="button"
                              onClick={() => removeQuestion(partIndex, questionIndex)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove Question
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Question Content
                              </label>
                              <textarea
                                value={question.content || ''}
                                onChange={(e) => handleQuestionChange(partIndex, questionIndex, 'content', e.target.value)}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                  errors[`part_${partIndex}_question_${questionIndex}_content`] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                }`}
                                placeholder="Enter question content"
                                rows="2"
                              ></textarea>
                              {errors[`part_${partIndex}_question_${questionIndex}_content`] && <p className="text-red-500 text-xs italic mt-1">{errors[`part_${partIndex}_question_${questionIndex}_content`]}</p>}
                            </div>

                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Question Type
                              </label>
                              <select
                                value={question.type || 'single_choice'}
                                onChange={(e) => handleQuestionChange(partIndex, questionIndex, 'type', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                              >
                                <option value="single_choice">Single Choice</option>
                                <option value="multiple_choice">Multiple Choice</option>
                                <option value="listening">Listening</option>
                                <option value="reading">Reading</option>
                                <option value="writing">Writing</option>
                                <option value="speaking">Speaking</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Order Index
                              </label>
                              <input
                                type="number"
                                value={question.order_index || 0}
                                onChange={(e) => handleQuestionChange(partIndex, questionIndex, 'order_index', parseInt(e.target.value) || 0)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                min="0"
                              />
                            </div>

                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Question Image (Thumbnail)
                              </label>
                              <input
                                type="text"
                                value={question.thumbnail || ''}
                                onChange={(e) => handleQuestionChange(partIndex, questionIndex, 'thumbnail', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter image URL (optional)"
                              />
                              <div className="mt-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(partIndex, 'thumbnail', e.target.files[0], false, null, true, questionIndex)}
                                  className="w-full p-2 border border-gray-300 rounded-lg"
                                  disabled={uploading[`part_${partIndex}_question_${questionIndex}_thumbnail`]}
                                />
                                {uploading[`part_${partIndex}_question_${questionIndex}_thumbnail`] && (
                                  <p className="text-blue-500 text-sm mt-1">Uploading image...</p>
                                )}
                                {question.thumbnail && (
                                  <img
                                    src={question.thumbnail}
                                    alt="Question thumbnail"
                                    className="mt-2 max-w-xs h-auto rounded"
                                  />
                                )}
                              </div>
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Question Audio (Record)
                              </label>
                              <input
                                type="text"
                                value={question.record || ''}
                                onChange={(e) => handleQuestionChange(partIndex, questionIndex, 'record', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter audio URL (optional)"
                              />
                              <div className="mt-2">
                                <input
                                  type="file"
                                  accept="audio/*"
                                  onChange={(e) => handleFileUpload(partIndex, 'record', e.target.files[0], false, null, true, questionIndex)}
                                  className="w-full p-2 border border-gray-300 rounded-lg"
                                  disabled={uploading[`part_${partIndex}_question_${questionIndex}_record`]}
                                />
                                {uploading[`part_${partIndex}_question_${questionIndex}_record`] && (
                                  <p className="text-blue-500 text-sm mt-1">Uploading audio...</p>
                                )}
                                {question.record && (
                                  <div className="mt-2">
                                    <audio controls className="w-full">
                                      <source src={question.record} type="audio/mpeg" />
                                      Your browser does not support the audio element.
                                    </audio>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-3">
                            <div className="flex justify-between items-center mb-2">
                              <h6 className="text-sm font-medium text-gray-700">Answers</h6>
                              <button
                                type="button"
                                onClick={() => addAnswer(partIndex, questionIndex)}
                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                              >
                                Add Answer
                              </button>
                            </div>

                            {question.answers && question.answers.length > 0 ? (
                              <div className="space-y-2">
                                {question.answers.map((answer, answerIndex) => (
                                  <div key={answerIndex} className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={answer.content}
                                      onChange={(e) => handleAnswerChange(partIndex, questionIndex, answerIndex, 'content', e.target.value)}
                                      className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                        errors[`part_${partIndex}_question_${questionIndex}_answers`] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                      }`}
                                      placeholder="Enter answer content"
                                    />
                                    <div className="flex items-center">
                                      <input
                                        type="radio"
                                        checked={answer.is_correct || false}
                                        onChange={() => setCorrectAnswer(partIndex, questionIndex, answerIndex)}
                                        className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                                      />
                                      <label className="ml-2 text-sm text-gray-700">Correct</label>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeAnswer(partIndex, questionIndex, answerIndex)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                                {errors[`part_${partIndex}_question_${questionIndex}_correct_answer`] && <p className="text-red-500 text-xs italic mt-1">{errors[`part_${partIndex}_question_${questionIndex}_correct_answer`]}</p>}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-xs italic">No answers added yet.</p>
                            )}
                            {/* WRITING and SPEAKING questions don't require predefined answers */}
                            {!((question.type === 'writing' || question.type === 'speaking') && 
                               (!question.answers || question.answers.length === 0)) && 
                               errors[`part_${partIndex}_question_${questionIndex}_answers`] && 
                               <p className="text-red-500 text-xs italic mt-1">{errors[`part_${partIndex}_question_${questionIndex}_answers`]}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No direct questions added yet.</p>
                  )}
                </div>

                {/* Child parts (for complex structures like TOEIC) */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium text-gray-700">Child Parts (Sub-sections)</h4>
                    <button
                      type="button"
                      onClick={() => addChildPart(partIndex)}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                    >
                      Add Sub-section
                    </button>
                  </div>

                  {part.parts && part.parts.length > 0 ? (
                    <div className="space-y-4">
                      {part.parts.map((childPart, childPartIndex) => (
                        <div key={childPartIndex} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-gray-800">Sub-section {childPartIndex + 1}</h5>
                            <button
                              type="button"
                              onClick={() => removeChildPart(partIndex, childPartIndex)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove Sub-section
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Sub-section Name *
                              </label>
                              <input
                                type="text"
                                value={childPart.name}
                                onChange={(e) => {
                                  const parts = [...exam.parts];
                                  parts[partIndex].parts[childPartIndex].name = e.target.value;
                                  setExam({ ...exam, parts });
                                }}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                  errors[`part_${partIndex}_child_${childPartIndex}_name`] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                }`}
                                placeholder="Enter sub-section name"
                              />
                              {errors[`part_${partIndex}_child_${childPartIndex}_name`] && <p className="text-red-500 text-xs italic mt-1">{errors[`part_${partIndex}_child_${childPartIndex}_name`]}</p>}
                            </div>

                            <div>
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Order Index
                              </label>
                              <input
                                type="number"
                                value={childPart.order_index}
                                onChange={(e) => {
                                  const parts = [...exam.parts];
                                  parts[partIndex].parts[childPartIndex].order_index = parseInt(e.target.value) || 0;
                                  setExam({ ...exam, parts });
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                min="0"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-gray-700 text-sm font-bold mb-2">
                                Sub-section Description
                              </label>
                              <textarea
                                value={childPart.description || ''}
                                onChange={(e) => {
                                  const parts = [...exam.parts];
                                  parts[partIndex].parts[childPartIndex].description = e.target.value;
                                  setExam({ ...exam, parts });
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter sub-section description"
                                rows="2"
                              ></textarea>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-3">
                            <div className="flex justify-between items-center mb-2">
                              <h6 className="text-sm font-medium text-gray-700">Questions</h6>
                              <button
                                type="button"
                                onClick={() => addQuestion(partIndex, true, childPartIndex)}
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              >
                                Add Question
                              </button>
                            </div>

                            {childPart.questions && childPart.questions.length > 0 ? (
                              <div className="space-y-4">
                                {childPart.questions.map((question, questionIndex) => (
                                  <div key={questionIndex} className="bg-white p-4 rounded-lg border border-gray-300">
                                    <div className="flex justify-between items-center mb-3">
                                      <h5 className="font-medium text-gray-800">Question {questionIndex + 1}</h5>
                                      <button
                                        type="button"
                                        onClick={() => removeQuestion(partIndex, questionIndex, true, childPartIndex)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                      >
                                        Remove Question
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                      <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                          Question Content
                                        </label>
                                        <textarea
                                          value={question.content || ''}
                                          onChange={(e) => handleQuestionChange(partIndex, questionIndex, 'content', e.target.value, true, childPartIndex)}
                                          className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                            errors[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_content`] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                          }`}
                                          placeholder="Enter question content"
                                          rows="2"
                                        ></textarea>
                                        {errors[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_content`] && <p className="text-red-500 text-xs italic mt-1">{errors[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_content`]}</p>}
                                      </div>

                                      <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                          Question Type
                                        </label>
                                        <select
                                          value={question.type || 'single_choice'}
                                          onChange={(e) => handleQuestionChange(partIndex, questionIndex, 'type', e.target.value, true, childPartIndex)}
                                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        >
                                          <option value="single_choice">Single Choice</option>
                                          <option value="multiple_choice">Multiple Choice</option>
                                          <option value="listening">Listening</option>
                                          <option value="reading">Reading</option>
                                          <option value="writing">Writing</option>
                                          <option value="speaking">Speaking</option>
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                          Order Index
                                        </label>
                                        <input
                                          type="number"
                                          value={question.order_index || 0}
                                          onChange={(e) => handleQuestionChange(partIndex, questionIndex, 'order_index', parseInt(e.target.value) || 0, true, childPartIndex)}
                                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                          min="0"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                          Question Image (Thumbnail)
                                        </label>
                                        <input
                                          type="text"
                                          value={question.thumbnail || ''}
                                          onChange={(e) => handleQuestionChange(partIndex, questionIndex, 'thumbnail', e.target.value, true, childPartIndex)}
                                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                          placeholder="Enter image URL (optional)"
                                        />
                                        <div className="mt-2">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(partIndex, 'thumbnail', e.target.files[0], true, childPartIndex, true, questionIndex)}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            disabled={uploading[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_thumbnail`]}
                                          />
                                          {uploading[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_thumbnail`] && (
                                            <p className="text-blue-500 text-sm mt-1">Uploading image...</p>
                                          )}
                                          {question.thumbnail && (
                                            <img
                                              src={question.thumbnail}
                                              alt="Question thumbnail"
                                              className="mt-2 max-w-xs h-auto rounded"
                                            />
                                          )}
                                        </div>
                                      </div>

                                      <div className="md:col-span-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                          Question Audio (Record)
                                        </label>
                                        <input
                                          type="text"
                                          value={question.record || ''}
                                          onChange={(e) => handleQuestionChange(partIndex, questionIndex, 'record', e.target.value, true, childPartIndex)}
                                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                          placeholder="Enter audio URL (optional)"
                                        />
                                        <div className="mt-2">
                                          <input
                                            type="file"
                                            accept="audio/*"
                                            onChange={(e) => handleFileUpload(partIndex, 'record', e.target.files[0], true, childPartIndex, true, questionIndex)}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                            disabled={uploading[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_record`]}
                                          />
                                          {uploading[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_record`] && (
                                            <p className="text-blue-500 text-sm mt-1">Uploading audio...</p>
                                          )}
                                          {question.record && (
                                            <div className="mt-2">
                                              <audio controls className="w-full">
                                                <source src={question.record} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                              </audio>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-3">
                                      <div className="flex justify-between items-center mb-2">
                                        <h6 className="text-sm font-medium text-gray-700">Answers</h6>
                                        <button
                                          type="button"
                                          onClick={() => addAnswer(partIndex, questionIndex, true, childPartIndex)}
                                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                        >
                                          Add Answer
                                        </button>
                                      </div>

                                                                                {question.answers && question.answers.length > 0 ? (
                                            <div className="space-y-2">
                                              {question.answers.map((answer, answerIndex) => (
                                                <div key={answerIndex} className="flex items-center space-x-2">
                                                  <input
                                                    type="text"
                                                    value={answer.content}
                                                    onChange={(e) => handleAnswerChange(partIndex, questionIndex, answerIndex, 'content', e.target.value, true, childPartIndex)}
                                                    className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                                      errors[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_answers`] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                                    }`}
                                                    placeholder="Enter answer content"
                                                  />
                                                  <div className="flex items-center">
                                                    <input
                                                      type="radio"
                                                      checked={answer.is_correct || false}
                                                      onChange={() => setCorrectAnswer(partIndex, questionIndex, answerIndex, true, childPartIndex)}
                                                      className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                                                    />
                                                    <label className="ml-2 text-sm text-gray-700">Correct</label>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => removeAnswer(partIndex, questionIndex, answerIndex, true, childPartIndex)}
                                                    className="text-red-600 hover:text-red-800"
                                                  >
                                                    Remove
                                                  </button>
                                                </div>
                                              ))}
                                              {errors[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_correct_answer`] && <p className="text-red-500 text-xs italic mt-1">{errors[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_correct_answer`]}</p>}
                                            </div>
                                          ) : (
                                            <p className="text-gray-500 text-xs italic">No answers added yet.</p>
                                          )}
                                          {/* WRITING and SPEAKING questions don't require predefined answers */}
                                          {!((question.type === 'writing' || question.type === 'speaking') && 
                                             (!question.answers || question.answers.length === 0)) && 
                                             errors[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_answers`] && 
                                             <p className="text-red-500 text-xs italic mt-1">{errors[`part_${partIndex}_child_${childPartIndex}_question_${questionIndex}_answers`]}</p>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm italic">No questions added yet.</p>
                            )}
                            {errors[`part_${partIndex}_child_${childPartIndex}_questions`] && <p className="text-red-500 text-xs italic mt-1">{errors[`part_${partIndex}_child_${childPartIndex}_questions`]}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No sub-sections added yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {errors.parts && <p className="text-red-500 text-xs italic mt-1">{errors.parts}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setExam({
              name: '',
              description: '',
              duration: 0,
              type: 'toeic',
              parts: [],
            });
            setErrors({});
            setSuccess(false);
          }}
          className="px-6 py-3 mr-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Reset
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            loading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Exam'}
        </button>
      </div>
    </div>
  );
};

export default CreateExam;

// controllers/exam/userAnswerController.js
import * as userAnswerService from '../../services/exam/userAnswer.service.js';

export const createUserAnswer = async (req, res) => {
  try {
    const userAnswer = await userAnswerService.createUserAnswer(req.body);
    res.status(201).json(userAnswer);
  } catch (error) {
    console.error('Error creating user answer:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserAnswersByAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userAnswers = await userAnswerService.getUserAnswersByAttemptId(attemptId);
    res.json(userAnswers);
  } catch (error) {
    console.error('Error getting user answers:', error);
    res.status(500).json({ message: error.message });
  }
};
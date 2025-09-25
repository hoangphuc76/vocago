import * as userProgressService from '../../services/program/userProgress.service.js';

export const createUserProgress = async (req, res) => {
  try {
    const { lessonPublicId, score } = req.body;
    const userId = req.user.id;

    await userProgressService.createProgressService({ lessonPublicId, userId, score });

    res.status(201).json({ message: 'Progress created successfully' });
  } catch (error) {
    console.error('Progress creation failed:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

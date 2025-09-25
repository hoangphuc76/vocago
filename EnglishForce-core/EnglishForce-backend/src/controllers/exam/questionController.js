import * as questionService from '../../services/exam/question.service.js';

export const getQuestionsByExam = async (req, res) => {
  try {
    const { publicId } = req.params;
    const questions = await questionService.getQuestionsByExamPublicId(publicId);
    res.json(questions);
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getQuestionsByPartId = async (req, res) => {
  try {
    const { partPublicId } = req.params;
    const questions = await questionService.getQuestionsByExamPartPublicId(partPublicId);

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error getting questions by part ID:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const question = await questionService.createQuestion(req.body);
    res.status(201).json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await questionService.deleteQuestion(req.params.publicId);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: error.message });
  }
};


export const getQuestionByPublicId = async (req, res) => {
  try {
    const { publicId } = req.params;
    const question = await questionService.getQuestionByPublicId(publicId);
    res.status(200).json(question);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const updateQuestion = async (req, res) => {
  try {
    const { questionPublicId } = req.params;
    const {
      content,
      type,
      order_index,
      thumbnail: thumbnailLink,
      record: recordLink,
    } = req.body;

    const updated = await questionService.updateQuestion(questionPublicId, {
      content,
      type,
      order_index: parseInt(order_index),
      thumbnailFile: req.files?.thumbnail?.[0] || null,
      recordFile: req.files?.record?.[0] || null,
      thumbnailLink: thumbnailLink || null,
      recordLink: recordLink || null,
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error('Update question failed:', err);
    res.status(500).json({ error: err.message });
  }
};
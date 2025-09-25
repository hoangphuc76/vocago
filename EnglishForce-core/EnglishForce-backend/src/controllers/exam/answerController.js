import * as answerService from '../../services/exam/answer.service.js';

export const getAnswersByQuestionPublicId = async (req, res) => {
    try {
        const { publicId } = req.params;
        const answers = await answerService.getAnswersByQuestionPublicId(publicId);
        res.status(200).json(answers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const createAnswer = async (req, res) => {
    try {
        const { question_public_id, content, is_correct } = req.body;

        const answer = await answerService.createAnswer({
            question_public_id,
            content,
            is_correct,
        });

        res.status(201).json(answer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const deleteAnswer = async (req, res) => {
    try {
      const { publicId } = req.params;
  
      await answerService.deleteAnswer(publicId);
  
      res.status(200).json({ message: 'Answer deleted successfully' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
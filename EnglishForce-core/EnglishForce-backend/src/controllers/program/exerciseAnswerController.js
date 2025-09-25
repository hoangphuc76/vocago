import * as exerciseAnswerService from '../../services/program/exerciseAnswer.service.js'

export const create = async (req, res) => {
  try {
    const { exercise_public_id, content, is_correct } = req.body;

    if (!exercise_public_id || !content || is_correct === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const answer = await exerciseAnswerService.createExerciseAnswer({
      exercise_public_id,
      content,
      is_correct
    });

    return res.status(201).json(answer);
  } catch (err) {
    console.error("Error creating answer:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getByPublicId = async (req, res) => {
  try {
    const answer = await exerciseAnswerService.getExerciseAnswerByPublicId(req.params.publicId);
    res.json(answer);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getByExercise = async (req, res) => {
  try {
    const answers = await exerciseAnswerService.getAnswersByExercise(req.params.exercisePublicId);
    res.json(answers);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await exerciseAnswerService.updateExerciseAnswer(req.params.publicId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await exerciseAnswerService.deleteExerciseAnswer(req.params.publicId);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

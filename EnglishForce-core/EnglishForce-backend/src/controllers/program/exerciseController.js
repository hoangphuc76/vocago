import * as exerciseService from '../../services/program/exercise.service.js';

export const getAllExercises = async (req, res) => {
  try {
    const exercises = await exerciseService.getAllExercises();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getExerciseByPublicId = async (req, res) => {
  try {
    const exercise = await exerciseService.getExerciseByPublicId(req.params.publicId);
    res.json(exercise);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const createExercise = async (req, res) => {
  try {
    const newExercise = await exerciseService.createExercise(req.body);
    res.status(201).json(newExercise);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateExercise = async (req, res) => {
  try {
    const updatedExercise = await exerciseService.updateExercise(req.params.publicId, req.body);
    res.json(updatedExercise);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    await exerciseService.deleteExercise(req.params.publicId);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

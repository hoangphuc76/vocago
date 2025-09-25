import * as lessonService from '../../services/program/lesson.service.js';

export const getAllLessons = async (req, res) => {
  try {
    const lessons = await lessonService.getAllLessons();
    res.json(lessons);
  } catch (err) {
    console.error('❌ getAllLessons:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getLessonByPublicId = async (req, res) => {
  try {
    const lesson = await lessonService.getLessonByPublicId(req.params.lessonPublicId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (err) {
    console.error('❌ getLessonByPublicId:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createLesson = async (req, res) => {
  try {
    const lesson = await lessonService.createLesson(req.body);
    res.status(201).json(lesson);
  } catch (err) {
    console.error('❌ createLesson:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const updated = await lessonService.updateLesson(req.params.lessonPublicId, req.body);
    if (!updated) return res.status(404).json({ message: 'Lesson not found' });
    res.json(updated);
  } catch (err) {
    console.error('❌ updateLesson:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const deleted = await lessonService.deleteLesson(req.params.lessonPublicId);
    if (!deleted) return res.status(404).json({ message: 'Lesson not found' });
    res.json({ message: 'Lesson deleted successfully' });
  } catch (err) {
    console.error('❌ deleteLesson:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



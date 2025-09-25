import db from '../../sequelize/models/index.js';
const { Exam, Question, Answer, ExamAttempt } = db;

export const getAnswersByQuestionPublicId = async (questionPublicId) => {
    const question = await Question.findOne({
        where: { public_id: questionPublicId }
    });

    if (!question) {
        throw new Error('Question not found');
    }

    const answers = await Answer.findAll({
        where: { question_id: question.id },
        order: [['id', 'ASC']]
    });

    return answers;
};



export const createAnswer = async ({ question_public_id, content, is_correct }) => {
    const question = await Question.findOne({
        where: { public_id: question_public_id },
    });

    if (!question) {
        throw new Error('Question not found');
    }

    // For WRITING and SPEAKING questions, is_correct is not required
    const isWritingOrSpeaking = question.type === 'writing' || question.type === 'speaking';
    
    const newAnswer = await Answer.create({
        question_id: question.id,
        content,
        is_correct: isWritingOrSpeaking ? null : is_correct,
    });

    return newAnswer;
};


export const deleteAnswer = async (publicId) => {
    const answer = await Answer.findOne({ where: { public_id: publicId } });

    if (!answer) {
        throw new Error('Answer not found');
    }

    await answer.destroy();
};
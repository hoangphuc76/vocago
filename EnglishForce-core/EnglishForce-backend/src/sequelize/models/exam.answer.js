// models/answer.js
export default (sequelize, DataTypes) => {
    const Answer = sequelize.define('Answer', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      public_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      is_correct: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      // For user answers - link to exam attempt
      exam_attempt_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'exam_attempts',
          key: 'id'
        }
      },
      // For WRITING questions
      text_answer: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      // For SPEAKING questions
      audio_record_url: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      // Gemini scoring results
      score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
      },
      strengths: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      weaknesses: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      suggestions: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'answers',
      timestamps: false,
    });
    Answer.associate = (models) => {
      Answer.belongsTo(models.Question, { foreignKey: 'question_id', onDelete: 'CASCADE' });
      Answer.belongsTo(models.ExamAttempt, { 
        foreignKey: 'exam_attempt_id', 
        onDelete: 'CASCADE' 
      });
    };
  
    return Answer;
  };
  
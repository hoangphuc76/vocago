export default (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
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
    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    exam_part_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
    },
    thumbnail: {
      type: DataTypes.TEXT // link ảnh minh họa (nếu có)
    },
    record: {
      type: DataTypes.TEXT // link file audio (nếu có)
    },
    type: {
      type: DataTypes.ENUM('single_choice', 'multiple_choice' , 'listening' , 'reading', 'writing', 'speaking'),
      defaultValue: 'single_choice',
    },
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    tableName: 'questions',
    timestamps: false
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Exam, {
      foreignKey: 'exam_id',
      onDelete: 'CASCADE'
    });

    Question.belongsTo(models.ExamPart, {
      foreignKey: 'exam_part_id',
      onDelete: 'CASCADE'
    });

    Question.hasMany(models.Answer, {
      foreignKey: 'question_id',
      onDelete: 'CASCADE'
    });
  };

  return Question;
};

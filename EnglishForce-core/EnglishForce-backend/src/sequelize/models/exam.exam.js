
export default (sequelize, DataTypes) => {
  const Exam = sequelize.define('Exam', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    public_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
    },
    duration: {
      type: DataTypes.INTEGER, // hoặc INTEGER nếu bạn muốn lưu phút/giây
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('general', 'toeic', 'ielts', 'toefl'),
      defaultValue: 'general'
    }
  }, {
    tableName: 'exams',
    timestamps: false
  });

  Exam.associate = (models) => {
    Exam.hasMany(models.ExamAttempt, { foreignKey: 'exam_id', onDelete: 'CASCADE' });
    Exam.hasMany(models.ExamPart, { foreignKey: 'exam_id', onDelete: 'CASCADE' });
    Exam.hasMany(models.Question, { foreignKey: 'exam_id', onDelete: 'CASCADE' })
  };

  return Exam;
};

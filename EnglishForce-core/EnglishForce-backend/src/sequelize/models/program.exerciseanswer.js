export default (sequelize, DataTypes) => {
    const ExerciseAnswer = sequelize.define('ExerciseAnswer', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
      exercise_id: { type: DataTypes.INTEGER },
      content: { type: DataTypes.TEXT, allowNull: false },
      is_correct: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
      tableName: 'exercise_answers',
      timestamps: false
    });
  
    ExerciseAnswer.associate = models => {
      ExerciseAnswer.belongsTo(models.Exercise, { foreignKey: 'exercise_id', onDelete: 'CASCADE' });
    };
  
    return ExerciseAnswer;
  };
  
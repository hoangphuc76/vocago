export default (sequelize, DataTypes) => {
    const Exercise = sequelize.define('Exercise', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
      lesson_id: { type: DataTypes.INTEGER },
      question: { type: DataTypes.TEXT, allowNull: false },
      type: { type: DataTypes.ENUM('single_choice', 'speaking', 'writing'), defaultValue: 'single_choice' },
      thumbnail: DataTypes.TEXT,
      record: DataTypes.TEXT,
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
      explanation: DataTypes.TEXT,
      
    }, {
      tableName: 'exercises',
      timestamps: false
    });
  
    Exercise.associate = models => {
      Exercise.belongsTo(models.Lesson, { foreignKey: 'lesson_id', onDelete: 'CASCADE' });
      Exercise.hasMany(models.ExerciseAnswer, { foreignKey: 'exercise_id', onDelete: 'CASCADE' });
    };
  
    return Exercise;
  };
  
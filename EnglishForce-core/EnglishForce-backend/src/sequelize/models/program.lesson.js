export default (sequelize, DataTypes) => {
    const Lesson = sequelize.define('Lesson', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
      unit_id: { type: DataTypes.INTEGER },
      name: { type: DataTypes.TEXT, allowNull: false },
      description: DataTypes.TEXT,
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
    }, {
      tableName: 'lessons',
      timestamps: false
    });
  
    Lesson.associate = models => {
      Lesson.belongsTo(models.Unit, { foreignKey: 'unit_id', onDelete: 'CASCADE' });
      Lesson.hasMany(models.Exercise, { foreignKey: 'lesson_id', onDelete: 'CASCADE' });
      Lesson.hasMany(models.UserProgress, { foreignKey: 'lesson_id', onDelete: 'CASCADE' });
    };
  
    return Lesson;
  };
  
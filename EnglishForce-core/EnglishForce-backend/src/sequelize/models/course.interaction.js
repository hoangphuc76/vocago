export default (sequelize, DataTypes) => {
  const UserCourseInteraction = sequelize.define('UserCourseInteraction', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    score: { type: DataTypes.FLOAT, allowNull: false }, // trọng số tương tác
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'interactions',
    timestamps: false
  });

  UserCourseInteraction.associate = (models) => {
    UserCourseInteraction.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    UserCourseInteraction.belongsTo(models.Course, { foreignKey: 'course_id', onDelete: 'CASCADE' });
  };

  return UserCourseInteraction;
};

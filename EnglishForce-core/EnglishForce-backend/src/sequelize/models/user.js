export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: DataTypes.TEXT,
    role: DataTypes.TEXT,
    stripe_customer_id: DataTypes.TEXT,
    avatar: DataTypes.TEXT,
    avatar_public_id: DataTypes.TEXT,
  }, {
    tableName: 'users',
    timestamps: false
  });

  User.associate = function (models) {
    User.belongsToMany(models.Course, {
      through: models.UserCourse,
      foreignKey: 'user_id',
      otherKey: 'course_id'
    });
    User.hasMany(models.UserCourse, { foreignKey: 'user_id', onDelete: 'CASCADE' });

    User.hasMany(models.Comment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  };

  return User;
};

export default (sequelize, DataTypes) => {
  const UserCourse = sequelize.define('UserCourse', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    course_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    rating: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    tableName: 'user_courses',
    timestamps: false
  });

  UserCourse.associate = (models) => {
    UserCourse.belongsTo(models.User, { foreignKey: 'user_id' , onDelete: 'CASCADE' });
    UserCourse.belongsTo(models.Course, { foreignKey: 'course_id', onDelete: 'CASCADE' });
  };
  
  return UserCourse;
};
// export default (sequelize, DataTypes) => {
//   const UserCourse = sequelize.define('UserCourse', {
//     rating: DataTypes.INTEGER,
//     comment: DataTypes.TEXT,
//   }, {
//     tableName: 'user_courses',
//     timestamps: false
//   });

//   UserCourse.associate = (models) => {
//     // Composite keys are implied in associations
//     UserCourse.belongsTo(models.User, { foreignKey: 'user_id' });
//     UserCourse.belongsTo(models.Course, { foreignKey: 'course_id' });
//   };

//   return UserCourse;
// };

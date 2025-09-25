export default (sequelize, DataTypes) => {
  const CourseSection = sequelize.define('CourseSection', {
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
    description: DataTypes.TEXT,
    course_id: DataTypes.INTEGER,
    video_link: DataTypes.TEXT,
    video_public_id: DataTypes.TEXT, // Public ID video (Cloudinary)
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'course_sections',
    timestamps: false
  });

  CourseSection.associate = function(models) {
    CourseSection.belongsTo(models.Course, { foreignKey: 'course_id' , onDelete: 'CASCADE' });
  };

  return CourseSection;
};

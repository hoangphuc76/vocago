export default (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
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
    instructor: DataTypes.TEXT,
    description: DataTypes.TEXT,
    thumbnail: DataTypes.TEXT,
    thumbnail_public_id: DataTypes.TEXT, // public ID image (Cloudinary)
    price: DataTypes.DECIMAL(10, 2)
  }, {
    tableName: 'courses',
    timestamps: false
  });

  Course.associate = function(models) {
    Course.belongsToMany(models.User, {
      through: models.UserCourse,
      foreignKey: 'course_id',
      otherKey: 'user_id'
    });
    Course.hasMany(models.UserCourse, { foreignKey: 'course_id' , onDelete: 'CASCADE' });

    Course.hasMany(models.CourseSection, { 
      foreignKey: 'course_id',
      onDelete: 'CASCADE'
    });
    Course.hasMany(models.Comment, { foreignKey: 'course_id' , onDelete: 'CASCADE' });
  };

    // 🔽 Static method 
    Course.findByPublicId = async function (publicId) {
      const course = await this.findOne({ where: { public_id: publicId } });
      if (!course) throw new Error('Course not found with that public_id');
      return course;
    };

  return Course;
};

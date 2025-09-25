export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
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
    user_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER,
    parent_comment_id: DataTypes.INTEGER,
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'comments',
    timestamps: false
  });

  Comment.associate = function(models) {
    Comment.belongsTo(models.User, { foreignKey: 'user_id',
      onDelete: 'CASCADE'
     });
    Comment.belongsTo(models.Course, { 
      foreignKey: 'course_id',
      onDelete: 'CASCADE' 
    });
    Comment.hasMany(models.Comment, {
      foreignKey: 'parent_comment_id',
      as: 'Replies',
      onDelete: 'CASCADE'
    });
    // Maybe ? 
    Comment.belongsTo(models.Comment, {
      foreignKey: 'parent_comment_id',
      as: 'Parent'
    });
  };

  return Comment;
};

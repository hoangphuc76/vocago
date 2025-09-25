export default (sequelize, DataTypes) => {
  const ExamPart = sequelize.define('ExamPart', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    public_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT
    },
    description: {
      type: DataTypes.TEXT
    },
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    thumbnail: DataTypes.TEXT,
    thumbnail_public_id: DataTypes.TEXT, // public ID image (Cloudinary)
    record: DataTypes.TEXT,
    record_public_id: DataTypes.TEXT,  // public ID record (Cloudinary)
    parent_part_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'exam_parts',
    timestamps: false
  });

  ExamPart.associate = (models) => {
    ExamPart.belongsTo(models.Exam, { foreignKey: 'exam_id', onDelete: 'CASCADE'});

    ExamPart.hasMany(models.Question, {
      foreignKey: 'exam_part_id',
      onDelete: 'CASCADE'
    });

    //Exam Part 
    ExamPart.belongsTo(models.ExamPart, {
      as: 'Parent', 
      foreignKey: 'parent_part_id', onDelete: 'SET NULL'
    });

    ExamPart.hasMany(models.ExamPart, {
      as: 'Children',
      foreignKey: 'parent_part_id', onDelete: 'CASCADE'
    });
  };

  return ExamPart;
};

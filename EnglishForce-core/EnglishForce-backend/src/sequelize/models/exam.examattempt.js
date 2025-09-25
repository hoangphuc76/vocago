// models/testattempt.js
export default (sequelize, DataTypes) => {
    const ExamAttempt = sequelize.define('ExamAttempt', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      public_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      user_id: DataTypes.INTEGER,
      exam_id: DataTypes.INTEGER,
      start: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end: {
        type: DataTypes.DATE,
        allowNull: false
      },
      score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
      },
      description: DataTypes.TEXT,
    }, {
      tableName: 'exam_attempts',
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    });
  
    ExamAttempt.associate = (models) => {
      ExamAttempt.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
      ExamAttempt.belongsTo(models.Exam, {
        foreignKey: 'exam_id',
        onDelete: 'CASCADE'
      });
    };
  
    return ExamAttempt;
  };
  
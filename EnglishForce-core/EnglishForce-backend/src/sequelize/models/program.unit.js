export default (sequelize, DataTypes) => {
    const Unit = sequelize.define('Unit', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
      program_id: { type: DataTypes.INTEGER },
      name: { type: DataTypes.TEXT, allowNull: false },
      description: DataTypes.TEXT,
      order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
    }, {
      tableName: 'units',
      timestamps: false
    });
  
    Unit.associate = models => {
      Unit.belongsTo(models.Program, { foreignKey: 'program_id', onDelete: 'CASCADE' });
      Unit.hasMany(models.Lesson, { foreignKey: 'unit_id', onDelete: 'CASCADE' });
    };
  
    return Unit;
  };
  
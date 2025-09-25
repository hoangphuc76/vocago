export default (sequelize, DataTypes) => {
    const LearningProgram = sequelize.define('Program', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        public_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, unique: true },
        name: { type: DataTypes.TEXT, allowNull: false },
        description: DataTypes.TEXT,
        thumbnail: DataTypes.TEXT,
        thumbnail_public_id: DataTypes.TEXT, // public ID image (Cloudinary)
        order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
    }, {
        tableName: 'programs',
        timestamps: false
    });

    LearningProgram.associate = models => {
        LearningProgram.hasMany(models.Unit, { foreignKey: 'program_id', onDelete: 'CASCADE' });
        LearningProgram.hasMany(models.UserProgress, { foreignKey: 'program_id', onDelete: 'CASCADE'});
          
    };

    return LearningProgram;
};

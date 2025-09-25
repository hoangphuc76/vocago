import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import process from 'process';
import { fileURLToPath, pathToFileURL  } from 'url';
import configFile from '../config/config.js';
// import dotenv from "dotenv";
// dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load all models dynamically
const files = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.endsWith('.js') &&
    !file.endsWith('.test.js') &&
    file !== 'exam.useranswer.js' // Exclude the deleted useranswer model
  );
});


for (const file of files) {
  const fullPath = pathToFileURL(path.join(__dirname, file)).href;
  const { default: modelDefiner } = await import(fullPath);
  const model = modelDefiner(sequelize, DataTypes);
  db[model.name] = model;
}

console.log('📦 Các model đã được nạp:', Object.keys(db));

// Call associate if available
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

import db from '../sequelize/models/index.js'; // Sequelize instance
const { User } = db;

export const findUserIdByPublicId = async (publicId) => {
  const user = await User.findOne({ where: { public_id: publicId } });
  if (!user) throw new Error('User not found with that public_id');
  return user.id;
}

// Tạo user mới
export const createUser = async (username, hashedPassword) => {
  return await User.create({
    username,
    password: hashedPassword,
    role: 'user'
  });
};

export const getAllUsers = async () => {
  const users = await User.findAll({
    order: [['id', 'ASC']],
  });
  return users;
};


export const getPagingUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { rows: users, count: totalItems } = await User.findAndCountAll({
    order: [['id', 'ASC']],
    offset,
    limit,
  });

  return {
    users,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
  };
};



export const getNumberOfUsers = async () => {
  const count = await User.count();
  return count;
};

// Tìm user theo username
export const getUserByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};


// Tìm user theo id
export const getUserById = async (id) => {
  return await User.findByPk(id);
};

export const getUserProfileWithStats = async (userId) => {
  const user = await getUserById(userId);

  const programsCount = await db.UserProgress.count({ where: { user_id: userId } });
  const examAttemptsCount = await db.ExamAttempt.count({ where: { user_id: userId } });
  const coursesCount = await db.UserCourse.count({ where: { user_id: userId } });

  const averageScoreExamResult = await db.ExamAttempt.findOne({
    attributes: [[db.Sequelize.fn('AVG', db.Sequelize.col('score')), 'avg']],
    where: { user_id: userId },
    raw: true
  });
  const averageScoreProgramResult = await db.UserProgress.findOne({
    attributes: [[db.Sequelize.fn('AVG', db.Sequelize.col('score')), 'avg']],
    where: { user_id: userId },
    raw: true
  });
  const averageScoreExam = parseFloat(averageScoreExamResult?.avg || 0).toFixed(2);
  const averageScoreProgram = parseFloat(averageScoreProgramResult?.avg || 0).toFixed(2);

  const examScoresOverTime = await db.ExamAttempt.findAll({
    where: { user_id: userId },
    attributes: ['score', 'created_at'],
    order: [['created_at', 'ASC']],
    raw: true
  });

  return {
    ...user.toJSON(),
    stats: {
      programsCount,
      examAttemptsCount,
      coursesCount,
      examScoresOverTime,
      averageScoreExam,
      averageScoreProgram,
    }
  };
};

export const updateUserPassword = async (id, hashedPassword) => {
  return await User.update(
    { password: hashedPassword },
    { where: { id: id } }
  );
};

export const deleteUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  await user.destroy();
  return user;
};

export const updateUserRole = async (id, role) => {
  const [updatedCount, [updatedUser]] = await User.update(
    { role },
    {
      where: { id },
      returning: true,
    }
  );

  return updatedUser || null;
};

// Update User
export const updateUser = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  await user.update(updateData);
  return user;
};


// OAuth serve
export async function findOrCreateUser(profile) {
  const email = profile.email; // Set username = email if login with Google, facebook
  const name = profile.username;

  // Tìm hoặc tạo user
  const [user, created] = await User.findOrCreate({
    where: { username: email },
    defaults: {
      email: email,
      password: email,
      role: 'user'
    }
  });

  return user;
}
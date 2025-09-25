import db from '../sequelize/models/index.js'; // Sequelize instance
const { Comment, User, Course } = db;


export const findCommentIdByPublicId = async (publicId) => {
  const comment = await Comment.findOne({ where: { public_id: publicId } });
  if (!comment) throw new Error('Comment not found with that public_id');
  return comment.id ;
}

// Lấy tất cả comment
export const getAllComments = async () => {
  const comments = await Comment.findAll();
  return comments.map(comment => comment.get({ plain: true }));
};

// Phân trang comment + tổng số lượng
export const getComments = async (offset, limit) => {
  try {
    const { count, rows } = await Comment.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Course,
          attributes: ['name'],
        },
      ],
    });

    return {
      comments: rows.map(row => row.get({ plain: true })),
      totalComments: count
    };
  } catch (error) {
    console.error("Error fetching comments from the database:", error);
    throw error;
  }
};

// Tạo comment mới
export const createComment = async (user_id, course_id, content, parent_comment_id = null) => {
  const comment = await Comment.create({
    user_id,
    course_id,
    content,
    parent_comment_id
  });

  return comment.get({ plain: true });
};

// Xóa comment theo id
export const deleteComment = async (id) => {
  const deletedCount = await Comment.destroy({
    where: { id }
  });
  return deletedCount > 0;
};

// Cập nhật nội dung comment
export const updateComment = async (commentId, content) => {
  try {
    const [count, [updatedComment]] = await Comment.update(
      { content },
      {
        where: { id: commentId },
        returning: true
      }
    );

    return updatedComment?.get({ plain: true }) || null;
  } catch (err) {
    console.error("Error updating comment:", err);
    throw err;
  }
};

// Lấy comment + username của user theo courseId
export const getDetailCommentsByCourseId = async (course_id) => {
  const comments = await Comment.findAll({
    where: { course_id },
    include: [
      {
        model: User,
        attributes: ['username','avatar']
      }
    ],
    order: [['created_at', 'DESC']]
  });

  return comments.map(c => {
    const plain = c.get({ plain: true });
    return {
      ...plain,
      username: plain.User?.username || null
    };
  });
};

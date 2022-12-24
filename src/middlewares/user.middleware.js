import User from '../database/models/User.js';
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      is_active: true,
    });
    if (!user) {
      return res.status(404).json({
        message: 'User  not found',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(404).json({
      message: 'User not found',
      error: error.message,
    });
  }
};

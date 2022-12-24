import User from '../database/models/User.js';
export const registerUser = async (user) => {
  return await User.create(user);
};

import User from '../database/models/User.js';

export const getUsers = async () => {
  const users = await User.find({ is_active: true });
  return users;
};
export const addUser = async (user) => {
  return await User.create(user);
};
export const updateUserService = async (update, user) => {
  const updateUser = await User.findByIdAndUpdate(user, update, {
    new: true,
  });

  return updateUser;
};
export const deleteUserService = async (user) => {
  const deleteUser = await User.findByIdAndUpdate(user, {
    new: true,
    is_active: false,
  });

  return deleteUser;
};
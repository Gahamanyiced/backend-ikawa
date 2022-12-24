import User from '../database/models/User.js';
import {
  getUsers,
  addUser,
  updateUserService,
  deleteUserService,
} from '../services/user.service.js';
import cloudinary from 'cloudinary';
export class userControllers {
  async getAllUsers(req, res) {
    try {
      const users = await getUsers();
      return res.status(200).json({
        count: users.length,
        users,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error while getting users',
        error: error.message,
      });
    }
  }
  async getUser(req, res) {
    try {
      const user = req.user;
      return res.status(200).json({
        user,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error while getting user',
        error: error.message,
      });
    }
  }

  async createUser(req, res) {
    try {
      const newUser = await addUser(req.body);
      return res.status(201).json({
        message: 'New user added',
        newUser,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Unable to add new user',
        error: error.message,
      });
    }
  }
  async updateUser(req, res) {
    try {
      const user = req.user;
      await updateUserService(req.body, user.id);
      return res.status(200).json({
        message: 'User updated successfully',
        user: { id: user.id, ...req.body },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Unable to update an user',
        error: error.message,
      });
    }
  }
  async deleteUser(req, res) {
    try {
      const user = req.user;
      await deleteUserService(user.id);
      return res.status(200).json({
        message: 'User deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Unable to delete an user',
        error: error.message,
      });
    }
  }
  async userPhotoUpload(req, res) {
    if (!req.files) {
      res.status(400).json({
        message: 'Please upload a file',
      });
    }
    const file = req.files.file;

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      res.status(400).json({
        message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} `,
      });
    }
    cloudinary.uploader.upload(file.tempFilePath, async (results, err) => {
      if (err) {
        return res.status(500).json({
          message: 'Problem with uploading the image',
          error: err,
        });
      }
      await User.findByIdAndUpdate(req.params.id, {
        picture: results.secure_url,
      });

      res.status(200).json({
        message: 'Document uploaded successfully',
        data: file.name,
      });
    });
  }
}

const userController = new userControllers();
export default userController;

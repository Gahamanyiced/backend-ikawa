import jwt from 'jsonwebtoken';
import User from '../database/models/User.js';

//Protect routes
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    console.log(token);
    //Make sure token exists
    if (!token) {
      return res.status(401).json({
        message: 'Not authorize to access this route',
      });
    }
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Error while being authorized',
      error: error.message,
    });
  }
};

// Get token from model,create cookie and send response
export const sendTokenToCookie = (req, res) => {
  try {
    const user = req.user;
    // create token
    const token = user.getSignedJwtToken();

    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
    res.status(200).cookie('token', token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error sending Token to cookie',
      error: error.message,
    });
  }
};
//Grant access to specific roles
export const authorize = (...roles) => {
  try {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `User role ${req.user.role} is not authorized to access this route`,
        });
      }
      next();
    };
  } catch (error) {}
};

//check User Exist by email or password
export const checkUserExist = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.find({
    email,
  });
  console.log(user);
  if (user.length > 0) {
    res.status(400).json({
      message: 'User Credential, is already registered',
    });
    return false;
  }
  next();
};

import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AuthenticationError('Not authorized to access this route'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new AuthenticationError('User not found'));
    }

    next();
  } catch (error) {
    next(new AuthenticationError('Not authorized to access this route'));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return next(new AuthorizationError('User not authorized to perform this action'));
    }

    next();
  };
};

export const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return next(new AuthorizationError('Only admins can access this route'));
  }
  next();
};

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      isPremium: user.isPremium,
    },
  });
};

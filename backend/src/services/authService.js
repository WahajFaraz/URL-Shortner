import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/helpers.js';
import { generateToken, sendTokenResponse } from '../middleware/auth.js';
import { ConflictError, ValidationError, NotFoundError, AuthenticationError } from '../utils/errors.js';
import { validateEmail } from '../utils/helpers.js';

export const registerUser = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new ValidationError('Please provide all required fields');
  }

  if (!validateEmail(email)) {
    throw new ValidationError('Please provide a valid email');
  }

  let user = await User.findOne({ email });
  if (user) {
    throw new ConflictError('Email already in use');
  }

  const hashedPassword = await hashPassword(password);
  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new ValidationError('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AuthenticationError('Invalid credentials');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AuthenticationError('Invalid credentials');
  }

  user.lastLogin = new Date();
  await user.save();

  return user;
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

export const updateUserProfile = async (id, updates) => {
  const allowedFields = ['name', 'avatar'];
  const filteredUpdates = {};
  
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  const user = await User.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

export const googleOAuthUser = async (googleId, email, name, avatar) => {
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      avatar,
    });
  } else if (!user.googleId) {
    user.googleId = googleId;
    user.avatar = avatar;
    await user.save();
  }

  user.lastLogin = new Date();
  await user.save();

  return user;
};

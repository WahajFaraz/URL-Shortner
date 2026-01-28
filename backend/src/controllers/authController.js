import { asyncHandler } from '../middleware/errorHandler.js';
import { sendTokenResponse } from '../middleware/auth.js';
import * as authService from '../services/authService.js';

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await authService.registerUser(name, email, password);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please login to continue.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isPremium: user.isPremium,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.loginUser(email, password);
  sendTokenResponse(user, 200, res);
});

export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await authService.getUserById(req.user.id);
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      totalLinks: user.totalLinks,
      totalClicks: user.totalClicks,
      isPremium: user.isPremium,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    },
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await authService.updateUserProfile(req.user.id, req.body);
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
});

export const googleAuth = asyncHandler(async (req, res, next) => {
  const { googleId, email, name, avatar } = req.body;
  const user = await authService.googleOAuthUser(googleId, email, name, avatar);
  sendTokenResponse(user, 200, res);
});

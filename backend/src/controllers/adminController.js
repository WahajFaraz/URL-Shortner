import { asyncHandler } from '../middleware/errorHandler.js';
import User from '../models/User.js';
import ShortUrl from '../models/ShortUrl.js';
import ClickAnalytics from '../models/ClickAnalytics.js';

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    users,
  });
});

export const disableUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  res.status(200).json({
    success: true,
    user,
  });
});

export const enableUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true }
  );

  res.status(200).json({
    success: true,
    user,
  });
});

export const disableLink = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const shortUrl = await ShortUrl.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  res.status(200).json({
    success: true,
    shortUrl,
  });
});

export const getAdminStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalLinks = await ShortUrl.countDocuments();
  const totalClicks = await ClickAnalytics.countDocuments();
  const premiumUsers = await User.countDocuments({ isPremium: true });

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalLinks,
      totalClicks,
      premiumUsers,
    },
  });
});

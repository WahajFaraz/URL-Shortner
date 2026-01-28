import ShortUrl from '../models/ShortUrl.js';
import ClickAnalytics from '../models/ClickAnalytics.js';
import User from '../models/User.js';
import { generateShortCode, generateHash, sanitizeUrl } from '../utils/helpers.js';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errors.js';
import qrcode from 'qrcode';

export const createShortUrl = async (userId, originalUrl, customAlias = null, options = {}) => {
  const { title, description, tags, expirationType, expirationDate, expirationClicks } = options;

  const normalizedOriginalUrl = sanitizeUrl(originalUrl);

  if (!normalizedOriginalUrl) {
    throw new ValidationError('Invalid URL format');
  }

  // Normalize alias: trim + lowercase; treat empty/whitespace as null
  const normalizedAlias =
    typeof customAlias === 'string' ? customAlias.trim().toLowerCase() : customAlias;

  const alias = normalizedAlias ? normalizedAlias : null;

  // Per-user: only allow shortening the same original URL once
  const existingForUser = await ShortUrl.findOne({
    userId,
    originalUrl: normalizedOriginalUrl,
  });
  if (existingForUser) {
    throw new ConflictError('You have already created a short link for this URL');
  }

  let shortCode = alias || generateShortCode();

  if (alias) {
    // Ensure alias doesn't collide with either an existing alias OR an existing shortCode
    const existing = await ShortUrl.findOne({
      $or: [{ customAlias: alias }, { shortCode: alias }],
    });
    if (existing) {
      throw new ConflictError('Custom alias already taken');
    }
  } else {
    // For random short codes, try multiple times to find a unique one
    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
      const exists = await ShortUrl.findOne({ shortCode });
      if (!exists) break;
      shortCode = generateShortCode();
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      throw new Error('Unable to generate unique short code. Please try again.');
    }
  }

  let qrCodeUrl = null;
  try {
    const shortUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/${shortCode}`;
    qrCodeUrl = await qrcode.toDataURL(shortUrl);
  } catch (error) {
    console.error('QR Code generation error:', error);
  }

  const createPayload = {
    userId,
    originalUrl: normalizedOriginalUrl,
    shortCode,
    title: title || null,
    description: description || null,
    tags: tags || [],
    expirationType,
    expirationDate,
    expirationClicks,
    clicksRemaining: expirationClicks,
    qrCode: qrCodeUrl,
  };

  // IMPORTANT: don't store customAlias when not provided (sparse+unique should ignore missing field)
  if (alias) {
    createPayload.customAlias = alias;
  }

  const shortUrlDoc = await ShortUrl.create(createPayload);

  const user = await User.findById(userId);
  user.totalLinks += 1;
  await user.save();

  return shortUrlDoc;
};

export const getShortUrl = async (identifier) => {
  if (!identifier) {
    return null;
  }
  
  const shortUrl = await ShortUrl.findOne({
    $or: [
      { shortCode: identifier.toLowerCase() },
      { customAlias: identifier.toLowerCase() },
    ],
  });

  return shortUrl;
};

export const getUserUrls = async (userId, page = 1, limit = 10, search = null, tags = null) => {
  let query = { userId };

  if (search) {
    query.$or = [
      { originalUrl: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
      { shortCode: { $regex: search, $options: 'i' } },
      { customAlias: { $regex: search, $options: 'i' } },
    ];
  }

  if (tags && tags.length > 0) {
    query.tags = { $in: tags };
  }

  const skip = (page - 1) * limit;
  const urls = await ShortUrl.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await ShortUrl.countDocuments(query);

  return {
    urls,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
};

export const updateShortUrl = async (userId, shortUrlId, updates) => {
  const shortUrl = await ShortUrl.findOne({ _id: shortUrlId, userId });
  if (!shortUrl) {
    throw new NotFoundError('Short URL not found');
  }

  const allowedFields = ['title', 'description', 'isActive', 'tags', 'expirationType', 'expirationDate', 'expirationClicks'];
  
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      shortUrl[field] = updates[field];
    }
  });

  await shortUrl.save();
  return shortUrl;
};

export const deleteShortUrl = async (userId, shortUrlId) => {
  const shortUrl = await ShortUrl.findOne({ _id: shortUrlId, userId });
  if (!shortUrl) {
    throw new NotFoundError('Short URL not found');
  }

  await ShortUrl.findByIdAndDelete(shortUrlId);
  await ClickAnalytics.deleteMany({ shortUrlId });

  const user = await User.findById(userId);
  user.totalLinks = Math.max(0, user.totalLinks - 1);
  await user.save();

  return true;
};

export const recordClick = async (shortUrlId, userId, clientInfo) => {
  const shortUrl = await ShortUrl.findById(shortUrlId);
  if (!shortUrl) {
    throw new NotFoundError('Short URL not found');
  }

  // Check expiration
  if (shortUrl.expirationType === 'date' && new Date(shortUrl.expirationDate) < new Date()) {
    throw new ValidationError('Link has expired');
  }

  if (shortUrl.expirationType === 'clicks' && shortUrl.clicksRemaining <= 0) {
    throw new ValidationError('Link has reached its click limit');
  }

  // Record analytics
  await ClickAnalytics.create({
    shortUrlId,
    userId,
    ...clientInfo,
  });

  // Update click count
  shortUrl.totalClicks += 1;
  if (shortUrl.expirationType === 'clicks') {
    shortUrl.clicksRemaining = Math.max(0, shortUrl.clicksRemaining - 1);
  }
  shortUrl.lastAccessedAt = new Date();
  await shortUrl.save();

  // Update user total clicks
  const user = await User.findById(userId);
  user.totalClicks += 1;
  await user.save();

  return shortUrl;
};

export const getAnalytics = async (userId, shortUrlId) => {
  const shortUrl = await ShortUrl.findOne({ _id: shortUrlId, userId });
  if (!shortUrl) {
    throw new NotFoundError('Short URL not found');
  }

  const analytics = await ClickAnalytics.find({ shortUrlId });

  // Aggregate data
  const countries = {};
  const devices = { mobile: 0, desktop: 0 };
  const browsers = {};
  const dailyClicks = {};

  analytics.forEach((click) => {
    countries[click.country] = (countries[click.country] || 0) + 1;
    devices[click.deviceType] += 1;
    browsers[click.browser] = (browsers[click.browser] || 0) + 1;

    const date = new Date(click.createdAt).toISOString().split('T')[0];
    dailyClicks[date] = (dailyClicks[date] || 0) + 1;
  });

  return {
    totalClicks: shortUrl.totalClicks,
    countries: Object.entries(countries).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    devices: Object.entries(devices).map(([name, count]) => ({ name, count })),
    browsers: Object.entries(browsers).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5),
    dailyClicks: Object.entries(dailyClicks).map(([date, count]) => ({ date, count })).sort((a, b) => new Date(a.date) - new Date(b.date)),
  };
};

export const getDashboardAnalytics = async (userId) => {
  const urls = await ShortUrl.find({ userId });
  const urlIds = urls.map((u) => u._id);

  const totalClicks = await ClickAnalytics.countDocuments({ shortUrlId: { $in: urlIds } });
  const recentClicks = await ClickAnalytics.countDocuments({
    shortUrlId: { $in: urlIds },
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  });

  const topUrls = await ShortUrl.find({ userId }).sort({ totalClicks: -1 }).limit(5);

  return {
    totalUrls: urls.length,
    totalClicks,
    recentClicks,
    topUrls,
  };
};

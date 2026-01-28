import { asyncHandler } from '../middleware/errorHandler.js';
import * as urlService from '../services/urlService.js';
import { getClientIp, detectDeviceType, extractBrowserInfo, extractOSInfo } from '../utils/helpers.js';
import geoip from 'geoip-lite';

export const createShortUrl = asyncHandler(async (req, res, next) => {
  const { originalUrl, customAlias, title, description, tags, expirationType, expirationDate, expirationClicks } = req.body;
  
  const shortUrl = await urlService.createShortUrl(req.user.id, originalUrl, customAlias, {
    title,
    description,
    tags: tags || [],
    expirationType: expirationType || 'never',
    expirationDate,
    expirationClicks,
  });

  res.status(201).json({
    success: true,
    shortUrl,
  });
});

export const getShortUrl = asyncHandler(async (req, res, next) => {
  const { shortCode } = req.params;

  const shortUrl = await urlService.getShortUrl(shortCode);
  
  if (!shortUrl) {
    return res.status(404).json({
      success: false,
      message: 'Short URL not found',
    });
  }

  if (!shortUrl.isActive) {
    return res.status(410).json({
      success: false,
      message: 'This link has been disabled',
    });
  }

  // Get client info
  const ip = getClientIp(req);
  const geo = geoip.lookup(ip);
  const deviceType = detectDeviceType(req.headers['user-agent']);
  const browser = extractBrowserInfo(req.headers['user-agent']);
  const os = extractOSInfo(req.headers['user-agent']);

  const clientInfo = {
    ipAddress: ip,
    country: geo?.country || 'Unknown',
    city: geo?.city || 'Unknown',
    deviceType,
    browser,
    os,
    referrer: req.headers.referer || null,
    userAgent: req.headers['user-agent'],
  };

  await urlService.recordClick(shortUrl._id, shortUrl.userId, clientInfo);

  // Redirect directly to the original URL
  res.redirect(301, shortUrl.originalUrl);
});

export const getUserUrls = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, search, tags } = req.query;
  
  const result = await urlService.getUserUrls(
    req.user.id,
    parseInt(page),
    parseInt(limit),
    search,
    tags ? tags.split(',') : null
  );

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getUrlDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const shortUrl = await urlService.getShortUrl(id);

  if (!shortUrl || shortUrl.userId.toString() !== req.user.id.toString()) {
    return res.status(404).json({
      success: false,
      message: 'Short URL not found',
    });
  }

  res.status(200).json({
    success: true,
    shortUrl,
  });
});

export const updateShortUrl = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const shortUrl = await urlService.updateShortUrl(req.user.id, id, req.body);

  res.status(200).json({
    success: true,
    shortUrl,
  });
});

export const deleteShortUrl = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await urlService.deleteShortUrl(req.user.id, id);

  res.status(200).json({
    success: true,
    message: 'Short URL deleted successfully',
  });
});

export const getUrlAnalytics = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const analytics = await urlService.getAnalytics(req.user.id, id);

  res.status(200).json({
    success: true,
    analytics,
  });
});

export const getDashboardAnalytics = asyncHandler(async (req, res, next) => {
  const analytics = await urlService.getDashboardAnalytics(req.user.id);

  res.status(200).json({
    success: true,
    analytics,
  });
});

import crypto from 'crypto';
import { BASE62_CHARS, SHORT_CODE_LENGTH } from '../config/constants.js';

export const generateShortCode = (length = SHORT_CODE_LENGTH) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += BASE62_CHARS.charAt(Math.floor(Math.random() * BASE62_CHARS.length));
  }
  return result;
};

export const generateHash = (str) => {
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 6);
};

export const hashPassword = async (password) => {
  const bcrypt = (await import('bcryptjs')).default;
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  const bcrypt = (await import('bcryptjs')).default;
  return await bcrypt.compare(password, hashedPassword);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const sanitizeUrl = (url) => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.toString();
  } catch {
    return null;
  }
};

export const detectDeviceType = (userAgent) => {
  const mobileRegex = /Mobile|Android|iPhone|iPad|iPod|Windows Phone|BlackBerry/i;
  return mobileRegex.test(userAgent) ? 'mobile' : 'desktop';
};

export const extractBrowserInfo = (userAgent) => {
  let browser = 'Unknown';
  if (userAgent.includes('Edge')) browser = 'Edge';
  else if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  return browser;
};

export const extractOSInfo = (userAgent) => {
  let os = 'Unknown';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
  return os;
};

export const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    '0.0.0.0';
};

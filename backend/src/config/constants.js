export const URL_REGEX = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&/=]*)$/;

export const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const SHORT_CODE_LENGTH = 6;

export const RATE_LIMIT_WINDOW = 15 * 60 * 1000;

export const RATE_LIMIT_MAX_REQUESTS = 100;

export const LINK_EXPIRATION_TYPES = ['never', 'date', 'clicks'];

export const CACHE_TTL = 3600;

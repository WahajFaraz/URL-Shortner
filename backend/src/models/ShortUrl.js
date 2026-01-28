import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalUrl: {
      type: String,
      required: [true, 'Please provide an original URL'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    customAlias: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9-_]{1,30}$/, 'Invalid custom alias format'],
    },
    title: {
      type: String,
      default: null,
      maxlength: 200,
    },
    description: {
      type: String,
      default: null,
      maxlength: 500,
    },
    totalClicks: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expirationType: {
      type: String,
      enum: ['never', 'date', 'clicks'],
      default: 'never',
    },
    expirationDate: {
      type: Date,
      default: null,
    },
    expirationClicks: {
      type: Number,
      default: null,
    },
    clicksRemaining: {
      type: Number,
      default: null,
    },
    qrCode: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    lastAccessedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ShortUrl', shortUrlSchema);

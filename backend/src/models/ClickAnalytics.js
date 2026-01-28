import mongoose from 'mongoose';

const clickAnalyticsSchema = new mongoose.Schema(
  {
    shortUrlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShortUrl',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: 'Unknown',
      index: true,
    },
    city: {
      type: String,
      default: 'Unknown',
    },
    deviceType: {
      type: String,
      enum: ['mobile', 'desktop'],
      default: 'desktop',
      index: true,
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    os: {
      type: String,
      default: 'Unknown',
    },
    referrer: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

clickAnalyticsSchema.index({ shortUrlId: 1, createdAt: -1 });
clickAnalyticsSchema.index({ userId: 1, createdAt: -1 });
clickAnalyticsSchema.index({ country: 1 });
clickAnalyticsSchema.index({ deviceType: 1 });
clickAnalyticsSchema.index({ createdAt: -1 });

export default mongoose.model('ClickAnalytics', clickAnalyticsSchema);

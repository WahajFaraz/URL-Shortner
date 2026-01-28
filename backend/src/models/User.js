import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      select: false,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
    totalLinks: {
      type: Number,
      default: 0,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

export default mongoose.model('User', userSchema);

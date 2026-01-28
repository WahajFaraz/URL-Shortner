import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import ShortUrl from './models/ShortUrl.js';
import { generateShortCode } from './utils/helpers.js';
import { hashPassword } from './utils/helpers.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await User.deleteMany({});
    await ShortUrl.deleteMany({});

    const hashedPassword = await hashPassword('password123');

    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        avatar: 'https://i.pravatar.cc/150?img=1',
        totalLinks: 0,
        totalClicks: 0,
        isAdmin: false,
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        avatar: 'https://i.pravatar.cc/150?img=2',
        totalLinks: 0,
        totalClicks: 0,
        isAdmin: true,
      },
    ]);

    const sampleUrls = [
      {
        userId: users[0]._id,
        originalUrl: 'https://www.github.com',
        shortCode: generateShortCode(),
        title: 'GitHub',
        description: 'Visit GitHub homepage',
        totalClicks: Math.floor(Math.random() * 100),
        tags: ['development', 'code'],
      },
      {
        userId: users[0]._id,
        originalUrl: 'https://www.stackoverflow.com',
        shortCode: generateShortCode(),
        title: 'Stack Overflow',
        description: 'Q&A for developers',
        totalClicks: Math.floor(Math.random() * 50),
        tags: ['help', 'learning'],
      },
    ];

    await ShortUrl.insertMany(sampleUrls);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

connectDB().then(seedDatabase);

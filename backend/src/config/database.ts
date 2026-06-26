import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const mongoUri =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';

export const connectToDatabase = async () => {
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
};

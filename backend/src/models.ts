import dotenv from 'dotenv';
import mongoose, { Schema } from 'mongoose';

dotenv.config();

export const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';

export const connectToDatabase = async () => {
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
};

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  team: String,
  fitnessGoal: String,
}, { timestamps: true });

const teamSchema = new Schema({
  name: { type: String, required: true },
  sport: String,
  members: [String],
  focus: String,
}, { timestamps: true });

const activitySchema = new Schema({
  userId: String,
  userName: String,
  type: String,
  durationMinutes: Number,
  notes: String,
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const leaderboardEntrySchema = new Schema({
  userId: String,
  name: String,
  score: Number,
  streak: Number,
  rank: Number,
}, { timestamps: true });

const workoutSchema = new Schema({
  title: { type: String, required: true },
  focus: String,
  durationMinutes: Number,
  difficulty: String,
  equipment: [String],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Team = mongoose.model('Team', teamSchema);
export const Activity = mongoose.model('Activity', activitySchema);
export const LeaderboardEntry = mongoose.model('LeaderboardEntry', leaderboardEntrySchema);
export const Workout = mongoose.model('Workout', workoutSchema);

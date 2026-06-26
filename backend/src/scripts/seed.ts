import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout, connectToDatabase, mongoUri } from '../models';

dotenv.config();

// Seed the octofit_db database with test data.

const seedData = async () => {
  await connectToDatabase();
  console.log(`Connected to MongoDB at ${mongoUri}`);

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const users = await User.insertMany([
    { name: 'Ava Patel', email: 'ava.patel@example.com', age: 29, team: 'Momentum', fitnessGoal: 'Marathon prep' },
    { name: 'Liam Chen', email: 'liam.chen@example.com', age: 34, team: 'Momentum', fitnessGoal: 'Strength gain' },
    { name: 'Mina Alvarez', email: 'mina.alvarez@example.com', age: 27, team: 'Velocity', fitnessGoal: 'Mobility improvement' },
  ]);

  const teams = await Team.insertMany([
    { name: 'Momentum', sport: 'CrossFit', members: users.slice(0, 2).map((user) => user.name), focus: 'Performance' },
    { name: 'Velocity', sport: 'Running', members: [users[2].name], focus: 'Endurance' },
  ]);

  await Activity.insertMany([
    { userId: users[0]._id.toString(), userName: users[0].name, type: 'Run', durationMinutes: 32, notes: 'Morning interval run' },
    { userId: users[1]._id.toString(), userName: users[1].name, type: 'Strength', durationMinutes: 45, notes: 'Upper body focus' },
    { userId: users[2]._id.toString(), userName: users[2].name, type: 'Yoga', durationMinutes: 25, notes: 'Mobility and recovery' },
  ]);

  await LeaderboardEntry.insertMany([
    { userId: users[0]._id.toString(), name: users[0].name, score: 920, streak: 7, rank: 1 },
    { userId: users[1]._id.toString(), name: users[1].name, score: 870, streak: 4, rank: 2 },
    { userId: users[2]._id.toString(), name: users[2].name, score: 845, streak: 5, rank: 3 },
  ]);

  await Workout.insertMany([
    { title: 'HIIT Cardio', focus: 'Endurance', durationMinutes: 25, difficulty: 'Intermediate', equipment: ['Jump rope', 'Timer'] },
    { title: 'Core Blast', focus: 'Core', durationMinutes: 20, difficulty: 'Beginner', equipment: ['Yoga mat'] },
    { title: 'Power Circuit', focus: 'Strength', durationMinutes: 40, difficulty: 'Advanced', equipment: ['Dumbbells', 'Bench'] },
  ]);

  console.log('Seed data inserted successfully.');
  await mongoose.disconnect();
};

seedData().catch((error) => {
  console.error('Failed to seed database', error);
  process.exit(1);
});

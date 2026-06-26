import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose, { Schema } from 'mongoose';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.use(cors());
app.use(express.json());

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  team: String,
});

const teamSchema = new Schema({
  name: { type: String, required: true },
  sport: String,
  members: [String],
});

const activitySchema = new Schema({
  userId: String,
  type: String,
  durationMinutes: Number,
  notes: String,
  completedAt: { type: Date, default: Date.now },
});

const leaderboardEntrySchema = new Schema({
  userId: String,
  name: String,
  score: Number,
  streak: Number,
});

const workoutSchema = new Schema({
  title: { type: String, required: true },
  focus: String,
  durationMinutes: Number,
  difficulty: String,
});

const User = mongoose.model('User', userSchema);
const Team = mongoose.model('Team', teamSchema);
const Activity = mongoose.model('Activity', activitySchema);
const LeaderboardEntry = mongoose.model('LeaderboardEntry', leaderboardEntrySchema);
const Workout = mongoose.model('Workout', workoutSchema);

const seedUsers = [
  { name: 'Ava', email: 'ava@example.com', age: 29, team: 'Momentum' },
  { name: 'Liam', email: 'liam@example.com', age: 34, team: 'Momentum' },
];

const seedTeams = [
  { name: 'Momentum', sport: 'CrossFit', members: ['Ava', 'Liam'] },
  { name: 'Velocity', sport: 'Running', members: ['Mina', 'Noah'] },
];

const seedActivities = [
  { userId: 'ava', type: 'Run', durationMinutes: 32, notes: 'Morning interval run' },
  { userId: 'liam', type: 'Strength', durationMinutes: 45, notes: 'Upper body focus' },
];

const seedLeaderboard = [
  { userId: 'ava', name: 'Ava', score: 920, streak: 7 },
  { userId: 'liam', name: 'Liam', score: 870, streak: 4 },
];

const seedWorkouts = [
  { title: 'HIIT Cardio', focus: 'Endurance', durationMinutes: 25, difficulty: 'Intermediate' },
  { title: 'Core Blast', focus: 'Core', durationMinutes: 20, difficulty: 'Beginner' },
];

const ensureSeedData = async <T>(Model: mongoose.Model<any>, seedData: T[]) => {
  const existing = await Model.find().lean();

  if (existing.length === 0) {
    await Model.insertMany(seedData);
    return seedData;
  }

  return existing;
};

const sendCollection = async (res: Response, handler: () => Promise<unknown>) => {
  try {
    const data = await handler();
    res.json(data);
  } catch (error) {
    console.error('Failed to load data', error);
    res.status(500).json({ error: 'Unable to load data' });
  }
};

const createCollectionRouter = (handler: () => Promise<unknown>) => {
  const router = express.Router();
  router.get('/', async (_req: Request, res: Response) => {
    await sendCollection(res, handler);
  });
  router.get('', async (_req: Request, res: Response) => {
    await sendCollection(res, handler);
  });
  return router;
};

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'octofit-backend', apiBaseUrl });
});

app.use('/api/users', createCollectionRouter(() => ensureSeedData(User, seedUsers)));
app.use('/api/teams', createCollectionRouter(() => ensureSeedData(Team, seedTeams)));
app.use('/api/activities', createCollectionRouter(() => ensureSeedData(Activity, seedActivities)));
app.use('/api/leaderboard', createCollectionRouter(() => ensureSeedData(LeaderboardEntry, seedLeaderboard)));
app.use('/api/workouts', createCollectionRouter(() => ensureSeedData(Workout, seedWorkouts)));

app.get('/', (_req: Request, res: Response) => {
  res.send('OctoFit Tracker backend is running');
});

const startServer = async () => {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
      console.log(`API base URL: ${apiBaseUrl}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

startServer();

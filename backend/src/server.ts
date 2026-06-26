import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {
  Activity,
  LeaderboardEntry,
  Team,
  User,
  Workout,
  connectToDatabase,
  mongoUri,
} from './models';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.use(cors());
app.use(express.json());

const ensureSeedData = async (Model: mongoose.Model<any>, seedData: unknown[]) => {
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

app.use('/api/users', createCollectionRouter(() => ensureSeedData(User, [])));
app.use('/api/teams', createCollectionRouter(() => ensureSeedData(Team, [])));
app.use('/api/activities', createCollectionRouter(() => ensureSeedData(Activity, [])));
app.use('/api/leaderboard', createCollectionRouter(() => ensureSeedData(LeaderboardEntry, [])));
app.use('/api/workouts', createCollectionRouter(() => ensureSeedData(Workout, [])));

app.get('/', (_req: Request, res: Response) => {
  res.send('OctoFit Tracker backend is running');
});

const startServer = async () => {
  try {
    await connectToDatabase();
    console.log(`Connected to MongoDB at ${mongoUri}`);

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


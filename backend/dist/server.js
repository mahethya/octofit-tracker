"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importStar(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 8000);
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: Number,
    team: String,
});
const teamSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    sport: String,
    members: [String],
});
const activitySchema = new mongoose_1.Schema({
    userId: String,
    type: String,
    durationMinutes: Number,
    notes: String,
    completedAt: { type: Date, default: Date.now },
});
const leaderboardEntrySchema = new mongoose_1.Schema({
    userId: String,
    name: String,
    score: Number,
    streak: Number,
});
const workoutSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    focus: String,
    durationMinutes: Number,
    difficulty: String,
});
const User = mongoose_1.default.model('User', userSchema);
const Team = mongoose_1.default.model('Team', teamSchema);
const Activity = mongoose_1.default.model('Activity', activitySchema);
const LeaderboardEntry = mongoose_1.default.model('LeaderboardEntry', leaderboardEntrySchema);
const Workout = mongoose_1.default.model('Workout', workoutSchema);
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
const ensureSeedData = async (Model, seedData) => {
    const existing = await Model.find().lean();
    if (existing.length === 0) {
        await Model.insertMany(seedData);
        return seedData;
    }
    return existing;
};
const sendCollection = async (res, handler) => {
    try {
        const data = await handler();
        res.json(data);
    }
    catch (error) {
        console.error('Failed to load data', error);
        res.status(500).json({ error: 'Unable to load data' });
    }
};
const createCollectionRouter = (handler) => {
    const router = express_1.default.Router();
    router.get('/', async (_req, res) => {
        await sendCollection(res, handler);
    });
    router.get('', async (_req, res) => {
        await sendCollection(res, handler);
    });
    return router;
};
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'octofit-backend', apiBaseUrl });
});
app.use('/api/users', createCollectionRouter(() => ensureSeedData(User, seedUsers)));
app.use('/api/teams', createCollectionRouter(() => ensureSeedData(Team, seedTeams)));
app.use('/api/activities', createCollectionRouter(() => ensureSeedData(Activity, seedActivities)));
app.use('/api/leaderboard', createCollectionRouter(() => ensureSeedData(LeaderboardEntry, seedLeaderboard)));
app.use('/api/workouts', createCollectionRouter(() => ensureSeedData(Workout, seedWorkouts)));
app.get('/', (_req, res) => {
    res.send('OctoFit Tracker backend is running');
});
const startServer = async () => {
    try {
        await mongoose_1.default.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Backend listening on port ${port}`);
            console.log(`API base URL: ${apiBaseUrl}`);
        });
    }
    catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
};
startServer();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("./models");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
app.use('/api/users', createCollectionRouter(() => ensureSeedData(models_1.User, [])));
app.use('/api/teams', createCollectionRouter(() => ensureSeedData(models_1.Team, [])));
app.use('/api/activities', createCollectionRouter(() => ensureSeedData(models_1.Activity, [])));
app.use('/api/leaderboard', createCollectionRouter(() => ensureSeedData(models_1.LeaderboardEntry, [])));
app.use('/api/workouts', createCollectionRouter(() => ensureSeedData(models_1.Workout, [])));
app.get('/', (_req, res) => {
    res.send('OctoFit Tracker backend is running');
});
const startServer = async () => {
    try {
        await (0, models_1.connectToDatabase)();
        console.log(`Connected to MongoDB at ${models_1.mongoUri}`);
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

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

// Resolve directory to guarantee server/.env is loaded regardless of execution working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // Ambient fallback

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Cross-Origin Resource Sharing
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root landing endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'PeopleDesk API Server is running',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// API Root Router
app.use('/api', apiRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB before listening on port
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`[PeopleDesk Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
    return server;
  } catch (error) {
    console.error(`[Fatal Startup Error] Server failed to start: ${error.message}`);
    process.exit(1);
  }
};

startServer();

export { app, startServer };
export default app;

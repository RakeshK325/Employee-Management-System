import express from 'express';
import mongoose from 'mongoose';
import employeeRoutes from './employeeRoutes.js';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    System health, uptime, and database readiness status
 * @access  Public
 */
router.get('/health', (req, res) => {
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;

  res.status(200).json({
    status: dbState === 1 ? 'healthy' : 'degraded',
    service: 'PeopleDesk API',
    database: dbStatusMap[dbState] || 'unknown',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(1)}s`,
  });
});

// Employee resources router
router.use('/employees', employeeRoutes);

export default router;

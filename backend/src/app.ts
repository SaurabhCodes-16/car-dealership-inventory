import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';
import { getDatabase } from './config/database';
import { requestIdMiddleware } from './middleware/requestId.middleware';

const app = express();

// Security, Tracing & Parsing Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(requestIdMiddleware);
app.use(cors({
  exposedHeaders: ['X-Request-ID']
}));
app.use(express.json({ limit: '1mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Health check endpoint with diagnostic telemetry
app.get('/health', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const vehicleCount = db.prepare('SELECT COUNT(*) as count FROM vehicles').get() as { count: number };
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };

    res.json({
      status: 'healthy',
      service: 'Car Dealership Inventory API',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        engine: 'SQLite3 (WAL)',
        status: 'connected',
        vehiclesCount: vehicleCount.count,
        usersCount: userCount.count
      },
      memory: {
        rssMB: Math.round(process.memoryUsage().rss / (1024 * 1024)),
        heapUsedMB: Math.round(process.memoryUsage().heapUsed / (1024 * 1024))
      }
    });
  } catch (err: any) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Database diagnostic check failed',
      details: err.message
    });
  }
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Centralized Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error occurred.',
    message: err.message || 'Unknown error'
  });
});

export default app;

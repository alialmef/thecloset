import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error-handler';
import healthRoutes from './routes/health';
import groupRoutes from './routes/groups';
import itemRoutes from './routes/items';
import borrowRequestRoutes from './routes/borrow-requests';
import outfitRoutes from './routes/outfits';

const app = express();
const PORT = process.env.PORT ?? 3000;

// ─── Global Middleware ───────────────────────────────

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// ─── Routes ─────────────────────────────────────────

app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/borrow-requests', borrowRequestRoutes);
app.use('/api/v1/outfits', outfitRoutes);

// ─── Error Handler (must be last) ───────────────────

app.use(errorHandler);

// ─── Start Server ───────────────────────────────────

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.warn(`Closet API running on http://localhost:${PORT}`);
    console.warn(`Health check: http://localhost:${PORT}/api/v1/health`);
  });
}

export default app;

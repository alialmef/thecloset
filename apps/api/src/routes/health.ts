import { Router, Response } from 'express';

const router = Router();

// GET /api/v1/health — Health check
router.get('/', (_req, res: Response) => {
  res.json({
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '0.1.0',
    },
  });
});

export default router;

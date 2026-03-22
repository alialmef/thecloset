import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import { paginationSchema } from '@closet/shared';
import * as feedService from '../services/feed-service';

const router = Router();

// GET /api/v1/feed — Get the social feed for the current user
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = paginationSchema.parse(req.query);
    const feed = await feedService.getGroupFeed(req.user!.id, page, limit);
    res.json({ data: feed });
  } catch (err) {
    next(err);
  }
});

export default router;

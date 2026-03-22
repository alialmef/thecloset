import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createOutfitSchema, paginationSchema } from '@closet/shared';
import * as outfitService from '../services/outfit-service';

const router = Router();

// POST /api/v1/outfits — Create an outfit
router.post(
  '/',
  authenticate,
  validate(createOutfitSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const outfit = await outfitService.createOutfit(req.user!.id, req.body);
      res.status(201).json({ data: outfit });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/v1/outfits/:id — Get a specific outfit
router.get(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const outfit = await outfitService.getOutfitById(req.params.id);
      res.json({ data: outfit });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/v1/outfits — List outfits styled for me or created by me
router.get(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const type = (req.query.type as 'created' | 'received') || 'received';
      const result = await outfitService.getUserOutfits(req.user!.id, type, page, limit);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  },
);

export default router;

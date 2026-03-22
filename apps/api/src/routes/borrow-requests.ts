import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createBorrowRequestSchema, updateBorrowRequestSchema } from '@closet/shared';
import * as borrowService from '../services/borrow-service';

const router = Router();

// POST /api/v1/borrow-requests — Create a borrow request
router.post(
  '/',
  authenticate,
  validate(createBorrowRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await borrowService.createBorrowRequest(req.user!.id, req.body);
      res.status(201).json({ data: request });
    } catch (err) {
      next(err);
    }
  },
);

// PATCH /api/v1/borrow-requests/:id — Approve or decline a borrow request
router.patch(
  '/:id',
  authenticate,
  validate(updateBorrowRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await borrowService.respondToBorrowRequest(
        req.params.id,
        req.user!.id,
        req.body.status,
      );
      res.json({ data: request });
    } catch (err) {
      next(err);
    }
  },
);

// POST /api/v1/borrow-requests/:id/return — Mark an item as returned
router.post(
  '/:id/return',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const request = await borrowService.returnItem(req.params.id, req.user!.id);
      res.json({ data: request });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/v1/borrow-requests/lent — Items I've lent out ("Who Has My Stuff")
router.get(
  '/lent',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requests = await borrowService.getLentItems(req.user!.id);
      res.json({ data: requests });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/v1/borrow-requests/borrowed — Items I've borrowed
router.get(
  '/borrowed',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requests = await borrowService.getBorrowedItems(req.user!.id);
      res.json({ data: requests });
    } catch (err) {
      next(err);
    }
  },
);

export default router;

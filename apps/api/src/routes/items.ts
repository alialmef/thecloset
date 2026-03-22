import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import {
  createItemSchema,
  updateItemSchema,
  itemFilterSchema,
  paginationSchema,
} from '@closet/shared';
import * as itemService from '../services/item-service';

const router = Router();

// GET /api/v1/items/user/:userId — Browse another user's items
// NOTE: This must be registered BEFORE /:id to avoid Express matching "user" as an id
router.get(
  '/user/:userId',
  authenticate,
  validate(itemFilterSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const result = await itemService.getUserItems(req.params.userId!, req.query, page, limit);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  },
);

// POST /api/v1/items — Create a new item
router.post(
  '/',
  authenticate,
  validate(createItemSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await itemService.createItem(req.user!.id, req.body);
      res.status(201).json({ data: item });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/v1/items — List current user's items
router.get(
  '/',
  authenticate,
  validate(itemFilterSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const result = await itemService.getUserItems(req.user!.id, req.query, page, limit);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/v1/items/:id — Get a specific item
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await itemService.getItemById(req.params.id!);
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/items/:id — Update an item
router.patch(
  '/:id',
  authenticate,
  validate(updateItemSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await itemService.updateItem(req.params.id!, req.user!.id, req.body);
      res.json({ data: item });
    } catch (err) {
      next(err);
    }
  },
);

// DELETE /api/v1/items/:id — Delete an item
router.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await itemService.deleteItem(req.params.id!, req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;

import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createUserSchema } from '@closet/shared';
import * as userService from '../services/user-service';

const router = Router();

// POST /api/v1/users — Create a new user (sign up)
router.post(
  '/',
  validate(createUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.createUser(req.body.name, req.body.phone, req.body.avatarUrl);
      res.status(201).json({ data: user });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/v1/users/me — Get current user profile
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.user!.id);
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/users/me/stats — Get current user's closet stats
router.get('/me/stats', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await userService.getUserStats(req.user!.id);
    res.json({ data: stats });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/users/me — Update current user profile
router.patch('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUser(req.user!.id, req.body);
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/users/:id — Get a user's public profile
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id!);
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

export default router;

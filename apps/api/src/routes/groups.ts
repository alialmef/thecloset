import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createGroupSchema, joinGroupSchema } from '@closet/shared';
import * as groupService from '../services/group-service';

const router = Router();

// POST /api/v1/groups — Create a new group
router.post(
  '/',
  authenticate,
  validate(createGroupSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const group = await groupService.createGroup(req.user!.id, req.body.name);
      res.status(201).json({ data: group });
    } catch (err) {
      next(err);
    }
  },
);

// POST /api/v1/groups/join — Join a group via invite code
router.post(
  '/join',
  authenticate,
  validate(joinGroupSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const membership = await groupService.joinGroup(req.user!.id, req.body.inviteCode);
      res.status(201).json({ data: membership });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/v1/groups — List user's groups
router.get(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groups = await groupService.getUserGroups(req.user!.id);
      res.json({ data: groups });
    } catch (err) {
      next(err);
    }
  },
);

// GET /api/v1/groups/:id — Get a specific group
router.get(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const group = await groupService.getGroupById(req.params.id, req.user!.id);
      res.json({ data: group });
    } catch (err) {
      next(err);
    }
  },
);

export default router;

import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../lib/errors';

export interface AuthenticatedUser {
  id: string;
  name: string;
  phone: string;
}

/* eslint-disable @typescript-eslint/no-namespace -- Express augments Request via global namespace */
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

/**
 * Auth middleware stub.
 *
 * TODO: Replace with real JWT verification once Firebase Auth is integrated.
 * For now, reads user ID from the `x-user-id` header for local development.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const userId = req.headers['x-user-id'] as string | undefined;

  if (!userId) {
    next(new UnauthorizedError('Missing authentication'));
    return;
  }

  // TODO: Verify JWT token and load user from database
  req.user = {
    id: userId,
    name: 'Dev User',
    phone: '+1234567890',
  };

  next();
}

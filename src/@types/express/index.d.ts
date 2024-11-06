import { AuthenticatedUser, SignedUser } from '@/types/user';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      files?: Express.Multer.File[];
    }
  }
}

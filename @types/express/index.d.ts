import { SignedUser } from "@/types/user";

declare global {
  namespace Express {
    interface Request {
      user: SignedUser;
    }
  }
}

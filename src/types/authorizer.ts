import { AuthenticatedUser } from "@/types/user";

export interface Authorizer {
  verify(token: string): AuthenticatedUser | undefined;
}

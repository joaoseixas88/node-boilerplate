import { SignedUser } from "@/types/user";

export interface Authorizer {
  verify(token: string): SignedUser | undefined;
}

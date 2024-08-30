import { User } from "@/types/user";

export interface Authorizer {
  verify(token: string): User | undefined;
}

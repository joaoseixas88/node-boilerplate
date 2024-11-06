export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface AuthenticatedUser {
  id: number;
  role: string;
  email: string;
  name: string;
}

export type ICreateUser = {
  idUserCreation?: number | null;
  fullName: string;
  document: string;
  phone?: string | null;
  login: string;
  email: string;
  password: string;
};

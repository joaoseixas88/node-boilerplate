export interface AuthTokenCreator {
  generateToken<T>(payload: T): string;
}


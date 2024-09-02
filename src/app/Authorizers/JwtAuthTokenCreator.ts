import { AuthTokenCreator } from "@/types";
import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";

@injectable()
export class JwtAuthTokenCreator implements AuthTokenCreator {
  constructor(
    @inject("tokenSecret")
    private readonly secret: string,
    @inject("tokenExpiresIn")
    private readonly expiresIn: string
  ) {}
  generateToken<T>(payload: T): string {
    const token = sign(payload as any, this.secret, {
      expiresIn: this.expiresIn,
    });
    return token;
  }
}

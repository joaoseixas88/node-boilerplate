import { Authorizer, AuthenticatedUser } from "@/types";
import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

@injectable()
export class JwtAuththorizer implements Authorizer {
  constructor(
    @inject("tokenSecret")
    private readonly secret: string
  ) {}

  verify(token: string) {
    try {
      const isValid = jwt.verify(token, this.secret);
      return isValid as AuthenticatedUser;
    } catch (error) {
      return undefined;
    }
  }
}

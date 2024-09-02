import { UnauthorizedException } from "@/app/Exceptions/Unauthorized";
import Database from "@/Database";
import { AuthTokenCreator } from "@/types";
import { compare } from "bcrypt";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthService {
  constructor(
    @inject("authGenerator")
    private readonly authGenerator: AuthTokenCreator
  ) {}
  async signin({ email, password }: { email: string; password: string }) {
    const user = await Database.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordMatches = await compare(user.password, password);
    if (passwordMatches) {
      const token = this.authGenerator.generateToken({
        id: user.id,
        role: user.role,
      });
      return {
        token,
        user,
      };
    }
    throw new UnauthorizedException();
  }
}

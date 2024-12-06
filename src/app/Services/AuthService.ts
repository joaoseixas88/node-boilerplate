import { UnauthorizedException } from "@/app/Exceptions/Unauthorized";
import Database from "@/infra/db/knex/Database1";
import { AuthTokenCreator, UserRole } from "@/types";
import { compare } from "bcrypt";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthService {
  constructor(
    @inject("authGenerator")
    private readonly authGenerator: AuthTokenCreator
  ) {}
  async signin({
    email,
    login,
    password,
  }: {
    email?: string;
    password: string;
    login?: string;
  }) {
    const user = await Database.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            login,
          },
        ],
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordMatches = await compare(password, user.password);
    if (passwordMatches) {
      const token = this.authGenerator.generateToken({
        id: user.id,
        role: user.role as UserRole,
        email: user.email,
        name: user.fullName,
      });
      return {
        token,
        user,
      };
    }
    throw new UnauthorizedException();
  }
}

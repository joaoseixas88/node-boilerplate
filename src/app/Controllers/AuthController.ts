import { HttpContextContract } from "@/types";
import { AuthService } from "../Services/AuthService";
import { SchemaValidator } from "@/app/Helpers/SchemaValidator";
import { AuthValidator } from "@/app/Validators/AuthValidator";
import { injectable } from "tsyringe";

@injectable()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async authenticate({ request, response }: HttpContextContract) {
    const params = SchemaValidator.validateSchema(
      AuthValidator.authenticate(),
      request.allParams()
    );
    const { token, user } = await this.authService.signin(params);
    return response.ok({
      user: {
        name: user.fullName,
        email: user.email,
      },
      token,
    });
  }
}

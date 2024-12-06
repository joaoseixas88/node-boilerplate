import { HttpContextContract } from "@/types";
import { injectable } from "tsyringe";
import { AuthService } from "../Services/AuthService";

@injectable()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async authenticate({ request, response }: HttpContextContract) {
   
   
  }
}

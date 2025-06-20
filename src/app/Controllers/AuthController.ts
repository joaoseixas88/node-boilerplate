import { HttpContextContract } from "@/types";
import { injectable } from "tsyringe";
import { UsersRepository } from "@/app/Repositories/UsersRepository";

@injectable()
export default class AuthController {
  constructor(private readonly userRepo: UsersRepository) {}
  async authenticate({ request, response }: HttpContextContract) {
    await this.userRepo.createOne({ email: "joao@maigl" });
  }
}

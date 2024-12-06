import { HttpContextContract } from "@/types";
import { injectable } from "tsyringe";
import Database from "@/infra/db/knex/Database";
import cuid from "cuid";
import { UsersRepository } from "@/app/Repositories/UsersRepository";

@injectable()
export class AuthController {
  constructor(
    private readonly userRepo: UsersRepository ,
  ){}
  async authenticate({ request, response }: HttpContextContract) {
    await this.userRepo.createOne({email: 'joao@maigl'})
  }
}

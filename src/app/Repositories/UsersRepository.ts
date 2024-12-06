import { BaseRepository } from "@/app/Repositories/BaseRepository";
import { UsersTable } from "@/types/database/users";
import cuid from "cuid";

export class UsersRepository extends BaseRepository<UsersTable> {
  constructor() {
    super("users", "id");
  }
  async createOne(user: Omit<UsersTable, "id">) {
    await this.create({ ...user, id: cuid() });
  }
}

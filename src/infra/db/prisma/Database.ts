import { PrismaClient } from "@prisma/client";
import { container } from "tsyringe";

export class PrismaRepository {
  private _client = new PrismaClient();
  private static instance: PrismaRepository;
  public static getInstance(): PrismaRepository {
    if (!this.instance) {
      this.instance = new PrismaRepository();
    }
    return this.instance;
  }
  async connect() {
    try {
      await this._client.$connect();
      console.log("Prisma connected");
    } catch (error) {
      console.error("Prisma connection erro: ", error);
    }
  }
  get client() {
    return this._client;
  }
}

const client = new PrismaRepository().client;
const Database = {
  client,
  user: client.user,
};
export default Database
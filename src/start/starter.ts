import { Router } from "@/infra/config";
import express, { json } from "express";
import { PrismaRepository } from "@/Database";
export class Starter {
  async start() {
    const app = express();
    await PrismaRepository.getInstance().connect();
    app.use(json());
    Router.applyRoutes(app);
    app.listen(3000, () => console.log(`\x1b[32mLOG Server started on port: 3000\x1b[0m`))
  }
}

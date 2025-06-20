import Env from "@/Env";
import { Router } from "@/infra/config";
import express, { json } from "express";
export class Starter {
  async start() {
    const app = express();
    app.use(json());
    await Router.applyRoutes(app);
    app.listen(Env.PORT, () =>
      console.log(`\x1b[32mLOG Server started on port: ${Env.PORT}\x1b[0m`)
    );
  }
}

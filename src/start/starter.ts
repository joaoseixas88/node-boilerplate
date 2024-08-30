import express, { json } from "express";
import { Router } from "@/infra/config/router";
export class Starter {
  start() {
    const app = express();
    app.use(json());
    Router.applyRoutes(app);
    app.listen(3000, () => console.log("Running"));
  }
	
}

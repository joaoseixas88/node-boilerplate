import { Router } from "@/infra/config";
import express, { json } from "express";
export class Starter {
  start() {
    const app = express();
    app.use(json());
    Router.applyRoutes(app);
    app.listen(3000, () => console.log("Running"));
  }
	
}

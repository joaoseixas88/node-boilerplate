import { AuthController } from "@/app/Controllers/AuthController";
import { Health } from "@/app/Controllers/Health";
import { Router } from "@/infra/config";

Router.get("/teste", Health, "start");

Router.post("/token", AuthController, "authenticate")

import { AuthController } from "@/app/Controllers/AuthController";
import { Health } from "@/app/Controllers/Health";
import { Router } from "@/infra/config";

Router.get("/teste", Health, "start");

Router.post("/token", AuthController, "authenticate").prefix("auth");

Router.group(() => {
  Router.get("/health", Health, "start");
  Router.group(() => {
    Router.post("/:id/ola", Health, "show");
  }).prefix("teste1").middleware('auth')
}).prefix("group")

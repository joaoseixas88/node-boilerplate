import { Health } from "@/app/Controllers/Health";
import { Router } from "@/infra/config/router";

Router.get("/teste", Health, "start")


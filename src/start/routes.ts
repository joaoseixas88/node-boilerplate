import { Router } from "@/infra/config";

Router.get("/health", "HealthControlle.start");

import { RouterAdapter } from "@/infra/config/adapters/RouteAdapter";
import { JwtAuththorizer } from "@/infra/config/JwtAuthorizer";
import { authMiddlewahe } from "@/infra/middlewares";
import { container } from "tsyringe";

container.register("authorizer", { useClass: JwtAuththorizer });
container.register("tokenSecret", { useValue: "secret" });
container.register("tokenExpires", { useValue: "1d" });
container.register("authMiddleware", { useValue: authMiddlewahe });
container.register(RouterAdapter, RouterAdapter);

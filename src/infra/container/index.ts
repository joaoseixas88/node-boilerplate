import { JwtAuththorizer } from "@/app/Authorizers/JwtAuthorizer";
import { RouterAdapter } from "@/infra/config/http/adapters/RouteAdapter";
import { authMiddlewahe } from "@/infra/config/http/middlewares";
import { container } from "tsyringe";

container.register("authorizer", { useClass: JwtAuththorizer });
container.register("tokenSecret", { useValue: "secret" });
container.register("tokenExpires", { useValue: "1d" });
container.register("authMiddleware", { useValue: authMiddlewahe });
container.register(RouterAdapter, RouterAdapter);

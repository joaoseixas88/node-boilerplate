import { JwtAuththorizer } from "@/app/Authorizers/JwtAuthorizer";
import { JwtAuthTokenCreator } from "@/app/Authorizers/JwtAuthTokenCreator";
import { RouterAdapter } from "@/infra/config/http/adapters/RouteAdapter";
import { authMiddlewahe } from "@/infra/config/http/middlewares";
import { container } from "tsyringe";

container.register("authGenerator", { useClass: JwtAuthTokenCreator });
container.register("authorizer", { useClass: JwtAuththorizer });
container.register("tokenSecret", { useValue: "secret" });
container.register("tokenExpiresIn", { useValue: "1d" });
container.register("authMiddleware", { useValue: authMiddlewahe });
container.register(RouterAdapter, RouterAdapter);

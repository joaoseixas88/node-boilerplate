import { authMiddleware } from "./middlewares";
import { Router as RoutingRoot } from "./router/Router";

export const Router = RoutingRoot.start({ auth: authMiddleware });

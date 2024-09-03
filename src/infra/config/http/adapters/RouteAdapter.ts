import { methodAdapterToExpress } from "@/infra/config/http/adapters/MethodAdapter";
import {
	Application,
	Router as ExpressRouter,
	NextFunction,
	Request,
	Response
} from "express";
import { inject, injectable, singleton } from "tsyringe";

const router = ExpressRouter();

export type RouterMiddleware = (
  req: Request,
  res: Response,
  next: () => NextFunction
) => void;

type MiddlewareEnum = "auth";

type RouteParams<T = any> = {
  path: string;
  controller: new (...args: any[]) => T;
  method: keyof T;
  httpMethod: "get" | "put" | "delete" | "post";
  middleware?: RouterMiddleware;
};

@singleton()
@injectable()
export class RouterAdapter {
  constructor(@inject("authMiddleware") authMiddleware: RouterMiddleware) {
    this.middlewares["auth"] = authMiddleware;
  }
  private middlewares = {} as Record<MiddlewareEnum, RouterMiddleware>;
  public routes: RouteParams[] = [];
  private add(router: RouteParams): RouteParams {
    this.routes.push(router);
    const lastRoute = this.routes[this.routes.length - 1];
    return lastRoute;
  }

  get<T>(path: string, controller: new (...args: any[]) => T, method: keyof T) {
    const route = this.add({
      controller,
      httpMethod: "get",
      method,
      path,
    });
    return {
      prefix: (path: string) => this._prefix(path, route),
      middleware: (middleware: MiddlewareEnum) => {
        return this.middleware(this.middlewares[middleware], route);
      },
    };
  }
  private middleware(middleware: RouterMiddleware, route: RouteParams) {
    route.middleware = middleware;
    return {
      prefix: (path: string) => this._prefix(path, route),
    };
  }

  private sanitizedPrefix(prefix: string, oldPath: string): string {
    let newRoutePath = "";
    const oldPathHasSlash = oldPath[0] === "/";
    const newPath = oldPathHasSlash ? oldPath : "/" + oldPath;
    const prefixHasSlash = prefix[0] === "/";
    newRoutePath = (prefixHasSlash ? prefix : "/" + prefix).concat(newPath);
    const lastIndex = newRoutePath.length - 1;
    const lastCharIsSlash = newRoutePath[lastIndex] === "/";
    return lastCharIsSlash ? newRoutePath.slice(0, lastIndex) : newRoutePath;
  }
  private _prefix(prefix: string, routeParams: RouteParams) {
    routeParams.path = this.sanitizedPrefix(prefix, routeParams.path);
    return {
      middleware: (middleware: MiddlewareEnum) =>
        this.middleware(this.middlewares[middleware], routeParams),
    };
  }
  group(callback: () => void) {
    const beforeLength = this.routes.length;
    callback();
    const afterLength = this.routes.length;
    const addedRoutes = this.routes.slice(beforeLength, afterLength);
    const chainableObject = {
      prefix: (path: string) => {
        for (const route of addedRoutes) {
          this._prefix(path, route);
        }
        return chainableObject;
      },
      middleware: (middleware: MiddlewareEnum) => {
        for (const route of addedRoutes) {
          this.middleware(this.middlewares[middleware], route);
        }
        return chainableObject;
      },
    };
    return chainableObject;
  }
  post<T>(
    path: string,
    controller: new (...args: any[]) => T,
    method: keyof T
  ) {
    const route = this.add({ controller, httpMethod: "post", method, path });
    return {
      prefix: (path: string) => this._prefix(path, route),
      middleware: (middleware: MiddlewareEnum) => {
        return this.middleware(this.middlewares[middleware], route);
      },
    };
  }
  put<T>(path: string, controller: new (...args: any[]) => T, method: keyof T) {
    const route = this.add({ controller, httpMethod: "put", method, path });
    return {
      prefix: (path: string) => this._prefix(path, route),
      middleware: (middleware: MiddlewareEnum) => {
        return this.middleware(this.middlewares[middleware], route);
      },
    };
  }
  delete<T>(
    path: string,
    controller: new (...args: any[]) => T,
    method: keyof T
  ) {
    const route = this.add({ controller, httpMethod: "delete", method, path });
    return {
      prefix: (path: string) => this._prefix(path, route),
      middleware: (middleware: MiddlewareEnum) => {
        return this.middleware(this.middlewares[middleware], route);
      },
    };
  }

  applyRoutes(app: Application) {
    for (const route of this.routes) {
      const { controller, method, path, httpMethod } = route;

      if (httpMethod === "get")
        router.get(path, methodAdapterToExpress(controller, method));
      if (httpMethod === "post")
        router.post(path, methodAdapterToExpress(controller, method));
      if (httpMethod === "put")
        router.put(path, methodAdapterToExpress(controller, method));
      if (httpMethod === "delete")
        router.delete(path, methodAdapterToExpress(controller, method));
    }
    app.use(router);
  }
}

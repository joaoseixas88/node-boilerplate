import { methodAdapterToExpress } from "@/infra/config/adapters/MethodAdapter";
import {
	Application,
	Router as ExpressRouter,
	NextFunction,
	Request,
	Response,
} from "express";
import { inject, injectable, singleton } from "tsyringe";

const router = ExpressRouter();

export type RouterMiddleware = (
  req: Request,
  res: Response,
  next: () => NextFunction
) => void;

type MiddlewareEnum = "auth";

@singleton()
@injectable()
export class RouterAdapter {
  constructor(@inject("authMiddleware") authMiddleware: RouterMiddleware) {
    this.middlewares["auth"] = authMiddleware;
  }
  private middlewares = {} as Record<MiddlewareEnum, RouterMiddleware>;

  private routes: ExpressRouter[] = [];
  private add(router: ExpressRouter): ExpressRouter {
    this.routes.push(router);
    const lastRoute = this.routes[this.routes.length - 1];
    return lastRoute;
  }
  private sanitize(path: string) {
    const pattern = /^\/([^\/]+\/?)+$/;
    if (pattern.test(path)) {
      path = path[0] === "/" ? path : "/" + path;
      return path;
    } else {
      throw new Error(`Malformed route: ${path}`);
    }
  }
  get<T>(path: string, controller: new (...args: any[]) => T, method: keyof T) {
    const route = this.add(
      router.get(
        this.sanitize(path),
        methodAdapterToExpress(controller, method)
      )
    );
    return {
      prefix: (path: string) => this._prefix(path, route),
      middleware: (middleware: MiddlewareEnum) => {
        return this.middleware(this.middlewares[middleware], route);
      },
    };
  }
  private middleware(middleware: RouterMiddleware, route: ExpressRouter) {
    router.use(middleware as () => void, route);
    return {
      prefix: (path: string) => this._prefix(path, route),
    };
  }

  private _prefix(path: string, route: ExpressRouter) {
    const hasSlash = path[0] === "/";
    router.use(hasSlash ? path : "/" + path, route);
    return {
      middleware: (middleware: MiddlewareEnum) =>
        this.middleware(this.middlewares[middleware], route),
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
    const route = this.add(
      router.post(
        this.sanitize(path),
        methodAdapterToExpress(controller, method)
      )
    );
    return {
      prefix: (path: string) => this._prefix(path, route),
      middleware: (middleware: MiddlewareEnum) => {
        return this.middleware(this.middlewares[middleware], route);
      },
    };
  }
  put<T>(path: string, controller: new (...args: any[]) => T, method: keyof T) {
    const route = this.add(
      router.put(
        this.sanitize(path),
        methodAdapterToExpress(controller, method)
      )
    );
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
    const route = this.add(
      router.delete(
        this.sanitize(path),
        methodAdapterToExpress(controller, method)
      )
    );
    return {
      prefix: (path: string) => this._prefix(path, route),
      middleware: (middleware: MiddlewareEnum) => {
        return this.middleware(this.middlewares[middleware], route);
      },
    };
  }

  applyRoutes(app: Application) {
    for (const route of this.routes) {
      app.use(route);
    }
  }
}

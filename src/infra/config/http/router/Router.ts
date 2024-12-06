import { Constructor } from "@/@types/constructor";
import { Application, Router as ExpressRouter, RequestHandler } from "express";
import { methodAdapterToExpress } from "../adapters/MethodAdapter";
import { GroupRoute } from "./GroupRoute";
import { MiddleTypes } from "./middletype";
import { Route } from "./Route";
import { HttpMethod } from "./route-types";

const expressRouter = ExpressRouter();

export class Router {
  private routes: (Route | GroupRoute)[] = [];
  private openGroup: GroupRoute[] = [];
  constructor(
    private readonly availableMiddlewares: Record<MiddleTypes, RequestHandler>
  ) {}

  private getHandler<T>(controller: Constructor<T>, method: keyof T) {
    const methodAdapted = methodAdapterToExpress(controller, method);
    return methodAdapted;
  }

  private pushToRoutes(route: Route | GroupRoute) {
    const openGroup = this.openGroup[this.openGroup.length - 1];
    if (openGroup) {
      openGroup.routes.push(route);
      return;
    }
    this.routes.push(route);
  }
  private route<T>(
    path: string,
    controller: Constructor<T>,
    method: keyof T,
    httpMethod: HttpMethod
  ) {
    const handler = this.getHandler(controller, method);
    const route = this.buildRoute(path, httpMethod, handler);
    this.pushToRoutes(route);
    return route;
  }

  private buildRoute<T>(
    path: string,
    httpMethod: HttpMethod,
    handler: RequestHandler
  ) {
    const route = new Route(
      path,
      httpMethod,
      this.availableMiddlewares,
      handler
    );
    return route;
  }

  group(callback: () => void) {
    const group = new GroupRoute([]);
    this.pushToRoutes(group);
    this.openGroup.push(group);
    callback();
    this.openGroup.pop();
    return group;
  }

  get<T>(path: string, controller: Constructor<T>, method: keyof T) {
    const route = this.route(path, controller, method, "get");
    return route;
  }
  post<T>(path: string, controller: Constructor<T>, method: keyof T) {
    const route = this.route(path, controller, method, "post");
    return route;
  }
  delete<T>(path: string, controller: Constructor<T>, method: keyof T) {
    const route = this.route(path, controller, method, "delete");
    return route;
  }
  put<T>(path: string, controller: Constructor<T>, method: keyof T) {
    const route = this.route(path, controller, method, "put");
    return route;
  }

  applyRoutes(app: Application) {
    for (const route of this.routes) {
      route.builder(expressRouter);
    }
    app.use(expressRouter);
    expressRouter.stack.forEach(({ route }) => {
      console.log(
        `\x1b[32mLOG\x1b[0m \x1b[33m[MappedRoute]\x1b[0m \x1b[32m{${
          route?.path
        }, ${route?.stack[0].method.toUpperCase()}}\x1b[0m`
      );
    });
  }
}

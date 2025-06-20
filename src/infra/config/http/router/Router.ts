import { Constructor } from "@/@types/constructor";
import { Application, Router as ExpressRouter, RequestHandler } from "express";
import { methodAdapterToExpress } from "../adapters/MethodAdapter";
import { GroupRoute } from "./GroupRoute";
import { MiddleTypes } from "./middletype";
import { Route } from "./Route";
import { HttpMethod } from "./route-types";
import path from "path";
import { readdirSync } from "fs";

const expressRouter = ExpressRouter();

export class Router {
  private routes: (Route | GroupRoute)[] = [];
  private openGroup: GroupRoute[] = [];
  private controllers: string[] = [];
  private directory = path.join(
    `${process.cwd()}`,
    "src",
    "app",
    "Controllers"
  );

  constructor(
    private readonly availableMiddlewares: Record<MiddleTypes, RequestHandler>
  ) {
    this.validateControllers();
  }

  validateControllers() {
    const allControllers = readdirSync(this.directory).map((ctr) =>
      ctr.replace(".ts", "")
    );

    console.log(" allControllers:", allControllers);

    for (const ctr of allControllers) {
      if (!this.controllers.includes(ctr)) {
        throw new Error(`Controller (${ctr}) not found`);
      }
    }
  }

  static start(middlewares: Record<MiddleTypes, RequestHandler>) {
    const router = new Router(middlewares);
    return router;
  }

  private pushToRoutes(route: Route | GroupRoute) {
    const openGroup = this.openGroup[this.openGroup.length - 1];
    if (openGroup) {
      openGroup.routes.push(route);
      return;
    }
    this.routes.push(route);
  }
  private route<T>(path: string, controller: string, httpMethod: HttpMethod) {
    this.controllers.push(controller);
    const route = this.buildRoute(path, httpMethod, controller);
    this.pushToRoutes(route);
    return route;
  }

  private buildRoute<T>(
    path: string,
    httpMethod: HttpMethod,
    controller: string
  ) {
    const route = new Route(
      path,
      httpMethod,
      this.availableMiddlewares,
      controller
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

  get<T>(path: string, controller: string) {
    const route = this.route(path, controller, "get");
    return route;
  }
  post<T>(path: string, controller: string) {
    const route = this.route(path, controller, "post");
    return route;
  }
  delete<T>(path: string, controller: string) {
    const route = this.route(path, controller, "delete");
    return route;
  }
  put<T>(path: string, controller: string) {
    const route = this.route(path, controller, "put");
    return route;
  }

  async applyRoutes(app: Application) {
    this.validateControllers();
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

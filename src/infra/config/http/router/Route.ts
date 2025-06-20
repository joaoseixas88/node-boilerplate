import {
  RequestHandler,
  Router as ExpressRouter,
  NextFunction,
  Request,
  Response,
} from "express";
import { MiddleTypes } from "./middletype";
import { HttpMethod } from "./route-types";
import { multerMiddleware } from "../middlewares";
import nodePath from "path";
import { methodAdapterToExpress } from "@/infra/config/http/adapters/MethodAdapter";
import { Constructor } from "@/@types/constructor";

export function dropSlash(input: string): string {
  if (input === "/") {
    return "/";
  }
  return `/${input.replace(/^\//, "").replace(/\/$/, "")}`;
}

export class Route {
  private _prefixes: string[] = [];
  private _middlewares: RequestHandler[] = [];
  private _directory = nodePath.join(
    `${process.cwd()}`,
    "src",
    "app",
    "Controllers"
  );
  private controllerName: string;
  private method: string;

  constructor(
    private readonly path: string,
    private readonly httpMethod: HttpMethod,
    private readonly availableMiddlewares: Record<MiddleTypes, RequestHandler>,
    private readonly controller: string
  ) {
    const [controllerName, method] = this.controller.split(".");
    this.controllerName = controllerName;
    this.method = method;
  }

  prefix(prefix: string) {
    this._prefixes.push(prefix);
    return this;
  }

  middleware(middleware: MiddleTypes) {
    this._middlewares.push(this.availableMiddlewares[middleware]);
    return this;
  }

  private checkMethod(controller: Constructor<any>) {
    const methods = Object.getOwnPropertyNames(controller.prototype);
    if (!methods.includes(this.method)) {
      throw new Error(
        `Method (${this.method}) not found in controller (${this.controllerName})`
      );
    }
  }

  private async importController(): Promise<Constructor<any>> {
    const controllerModule = await import(
      `${this._directory}/${this.controllerName}`
    );

    if (!controllerModule.default) {
      throw new Error(`Controller (${this.controllerName}) not found`);
    }
    const controller = controllerModule.default;
    this.checkMethod(controller);
    return controller;
  }

  get prefixes() {
    return this._prefixes;
  }
  get middlewares() {
    return this._middlewares;
  }

  private getPattern() {
    const pattern = dropSlash(this.path);
    const prefix = this.prefixes
      .slice()
      .reverse()
      .map((one) => dropSlash(one))
      .join("");

    return prefix ? `${prefix}${pattern === "/" ? "" : pattern}` : pattern;
  }

  get builder() {
    return this.applyRoute;
  }

  private async getHandler(req: Request, res: Response, next: NextFunction) {
    const controller = await this.importController();
    const method = this.controller.split(".")[1];
    const methodAdapted = methodAdapterToExpress(controller, method);
    return methodAdapted(req, res, next);
  }

  private async applyRoute(expressRouter: ExpressRouter) {
    const pattern = this.getPattern();
    const handler = (req: Request, res: Response, next: NextFunction) =>
      this.getHandler(req, res, next);
    const handlers = await Promise.all(
      this.middlewares.length
        ? [...this.middlewares, multerMiddleware, handler]
        : [multerMiddleware, handler]
    );
    switch (this.httpMethod) {
      case "get":
        expressRouter.get(pattern, ...handlers);
        break;
      case "put":
        expressRouter.put(pattern, ...handlers);
        break;
      case "delete":
        expressRouter.delete(pattern, ...handlers);
        break;
      case "post":
        expressRouter.post(pattern, ...handlers);
        break;
    }
  }
}

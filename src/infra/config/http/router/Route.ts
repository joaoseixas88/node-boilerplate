import { Application, RequestHandler, Router as ExpressRouter } from "express";
import { MiddleTypes } from "./middletype";
import { HttpMethod } from "./route-types";

export function dropSlash(input: string): string {
  if (input === "/") {
    return "/";
  }
  return `/${input.replace(/^\//, "").replace(/\/$/, "")}`;
}

export class Route {
  private _prefixes: string[] = [];
  private _middlewares: RequestHandler[] = [];

  constructor(
    private readonly path: string,
    private readonly httpMethod: HttpMethod,
    private readonly availableMiddlewares: Record<MiddleTypes, RequestHandler>,
    private readonly handler: RequestHandler
  ) {}

  prefix(prefix: string) {
    this._prefixes.push(prefix);
    return this;
  }

  middleware(middleware: MiddleTypes) {
    this._middlewares.push(this.availableMiddlewares[middleware]);
    return this;
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

  get builder(){
    return this.applyRoute
  }

  private applyRoute(expressRouter: ExpressRouter) {
    const pattern = this.getPattern();
    const handler: RequestHandler[] = this.middlewares.length
      ? [...this.middlewares, this.handler]
      : [this.handler];
    switch (this.httpMethod) {
      case "get":
        expressRouter.get(pattern, ...handler);
        break;
      case "put":
        expressRouter.put(pattern, ...handler);
        break;
      case "delete":
        expressRouter.delete(pattern, ...handler);
        break;
      case "post":
        expressRouter.post(pattern, ...handler);
        break;
    }
  }
}

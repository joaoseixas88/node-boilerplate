import { MiddleTypes } from "./middletype";
import { Route } from "./Route";
import { Router as ExpressRouter } from "express";

export class GroupRoute {
  private middlewares: MiddleTypes[] = [];
  constructor(public routes: (Route | GroupRoute)[]) {}
  prefix(prefix: string) {
    for (const route of this.routes) {
      route.prefix(prefix);
    }
    return this
  }
  middleware(middleware: MiddleTypes) {
    this.middlewares.push(middleware);
    return this
  }

  get builder(){
    return this.applyRoute
  }

  private applyRoute(expressRouter: ExpressRouter) {
    for (const route of this.routes) {
      route.builder(expressRouter)
    }
  }
}

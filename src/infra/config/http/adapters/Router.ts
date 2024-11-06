// import { Constructor } from "@/@types/constructor";
// import { AuthController } from "@/Controllers/AuthController";
// import { methodAdapterToExpress } from "@/infra/config/http/adapters/MethodAdapter";
// import { authMiddlewahe } from "@/infra/config/http/middlewares";
// import { Application, NextFunction, RequestHandler } from "express";
// import express, { Router as ExpressRouter } from "express";




// const app = express();

// export type RouterMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => void;

// type MiddlewareEnum = "auth";

// type HttpMethod = "get" | "put" | "delete" | "post";

// type RouteParams<T = any> = {
//   path: string;
//   controller: new (...args: any[]) => T;
//   method: keyof T;
//   httpMethod: "get" | "put" | "delete" | "post";
//   middlewares?: RequestHandler[];
// };

// export class GroupRoute {
//   private middlewares: MiddlewareEnum[] = [];
//   constructor(public routes: Route[]) {}
//   prefix(prefix: string) {
//     for (const route of this.routes) {
//       route.prefix(prefix);
//     }
//   }
//   middleware(middleware: MiddlewareEnum) {
//     this.middlewares.push(middleware);
//   }
// }

// export class _Router {
//   private routes: Route[] = [];
//   private groups: Route[] = [];
//   private openGroup: GroupRoute[] = [];
//   constructor(
//     private readonly app: Application,
//     private readonly availableMiddlewares: Record<
//       MiddlewareEnum,
//       RequestHandler
//     >
//   ) {}

//   private getHandler<T>(controller: Constructor<T>, method: keyof T) {
//     const methodAdapted = methodAdapterToExpress(controller, method);
//     return methodAdapted;
//   }

//   private route<T>(
//     path: string,
//     controller: Constructor<T>,
//     method: keyof T,
//     httpMethod: HttpMethod
//   ) {
//     if (this.openGroup.length){

//     }
//     const handler = this.getHandler(controller, method);
//     const route = this.buildRoute(path, httpMethod, handler);
//     this.routes.push(route);
//     return route;
//   }

//   private buildRoute<T>(
//     path: string,
//     httpMethod: HttpMethod,
//     handler: RequestHandler
//   ) {
//     const route = new Route(
//       path,
//       httpMethod,
//       this.app,
//       this.availableMiddlewares,
//       handler
//     );
//     return route;
//   }

//   group(callback: () => void) {
//     const group = new GroupRoute([]);
    
//     this.openGroup.push(group);
//     callback();
//     this.openGroup.pop();
//     return group;
//   }

//   get<T>(path: string, controller: Constructor<T>, method: keyof T) {
//     const route = this.route(path, controller, method, "get");
//     this.routes.push(route);
//     return route;
//   }
//   post<T>(path: string, controller: Constructor<T>, method: keyof T) {
//     const route = this.route(path, controller, method, "post");
//     this.routes.push(route);
//     return route;
//   }
//   delete<T>(path: string, controller: Constructor<T>, method: keyof T) {
//     const route = this.route(path, controller, method, "delete");
//     this.routes.push(route);
//     return route;
//   }
//   put<T>(path: string, controller: Constructor<T>, method: keyof T) {
//     const route = this.route(path, controller, method, "put");
//     this.routes.push(route);
//     return route;
//   }

//   applyRouter() {
//     for (const route of this.routes) {
//     }
//   }
// }
// export class Route {
//   private _prefixes: string[] = [];
//   private _middlewares: RequestHandler[] = [];

//   constructor(
//     private readonly path: string,
//     private readonly httpMethod: HttpMethod,
//     private readonly app: Application,
//     private readonly availableMiddlewares: Record<
//       MiddlewareEnum,
//       RequestHandler
//     >,
//     private readonly handler: RequestHandler
//   ) {}

//   prefix(prefix: string) {
//     this._prefixes.push(prefix);
//     return this;
//   }

//   middleware(middleware: MiddlewareEnum) {
//     this._middlewares.push(this.availableMiddlewares[middleware]);
//     return this;
//   }

//   get prefixes() {
//     return this._prefixes;
//   }
//   get middlewares() {
//     return this._middlewares;
//   }

//   private getPattern() {
//     const pattern = dropSlash(this.path);
//     const prefix = this.prefixes
//       .slice()
//       .reverse()
//       .map((one) => dropSlash(one))
//       .join("");

//     return prefix ? `${prefix}${pattern === "/" ? "" : pattern}` : pattern;
//   }
//   applyRoute() {
//     const pattern = this.getPattern();
//     const handler: RequestHandler[] = this.middlewares.length
//       ? [...this.middlewares, this.handler]
//       : [this.handler];
//     const params = [pattern, ...handler];
//     switch (this.httpMethod) {
//       case "get":
//         this.app.get(pattern, ...handler);
//       case "put":
//         this.app.put(pattern, ...handler);
//       case "delete":
//         this.app.delete(pattern, ...handler);
//       case "post":
//         this.app.post(pattern, ...handler);
//     }
//   }
// }

// const Router = new _Router(app, { auth: () => authMiddlewahe });

// Router.get("some_path", AuthController, "authenticate").middleware("auth");

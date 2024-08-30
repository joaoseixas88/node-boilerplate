import { container } from "tsyringe";
import { RouterAdapter } from "./adapters/RouteAdapter";

export const Router = container.resolve(RouterAdapter);

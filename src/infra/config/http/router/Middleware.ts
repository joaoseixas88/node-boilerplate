import { HttpContextContract } from "@/types";
import { NextFunction } from "express";

export abstract class Middleware {
  abstract handle(ctx: HttpContextContract, next: NextFunction): void
}



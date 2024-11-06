import { JwtAuththorizer } from "@/app/Authorizers/JwtAuthorizer";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { container } from "tsyringe";

export const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).json("Authorization required");
    return;
  }
  const [bearer, token] = authorization?.split(" ");
  if (!token || bearer !== "Bearer") {
    res.status(400).json("Malformed token");
    return;
  }
  const authorizer = container.resolve(JwtAuththorizer);
  const user = authorizer.verify(token);
  if (!user) {
    res.status(403).json("Not authorized");
    return;
  } else {
    req.user = user;
    next();
  }
};

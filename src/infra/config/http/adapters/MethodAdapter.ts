import { HttpException, ValidationException } from "@/app/Exceptions";
import { HttpContextContract, HttpResponse } from "@/types";
import { Request, Response } from "express";
import { container } from "tsyringe";

const returnHttpException = (err: HttpException): HttpResponse => ({
  statusCode: err.statusCode,
  data: err.message,
});

const httpContextAdapter = (
  req: Request,
  res: Response
): HttpContextContract => {
  return {
    response: {
      sendFile: (filePath: string, fileName?: string) => {
        const options = fileName
          ? {
              headers: {
                "Content-Disposition": `attachment; filename=${fileName}`,
              },
            }
          : {};
        return res.sendFile(filePath, options, (err: any) => {
          if (err) {
            console.error(err);
            res.status(500).send("Internal server error");
          }
        });
      },
      ok(data) {
        return { statusCode: 200, data };
      },
      created() {
        return { statusCode: 201 };
      },
      internalServerError(err) {
        return { statusCode: 500, data: "Internal Server Error" };
      },
      noContent() {
        return { statusCode: 204 };
      },
      notFound(message) {
        return {
          statusCode: 404,
          data: message,
        };
      },
      badRequest(error) {
        if (error instanceof HttpException) returnHttpException(error);
        if (typeof error === "string") {
          return {
            statusCode: 400,
            data: error,
          };
        }
        return {
          statusCode: 400,
          data: "BadRequest",
        };
      },
    },
    request: {
      allParams() {
        const allParams = {
          ...(req.body ?? {}),
          ...(req.query ?? {}),
          ...(req.params ?? {}),
        };
        return allParams;
      },
      auth: {
        user: req.user,
      },
      body() {
        return req.body ?? {};
      },
      headers() {
        return req.headers;
      },
      params() {
        return req.params;
      },
      queryParams() {
        const queryParams = {
          ...((req.query ?? {}) as Record<string, string>),
        };
        return queryParams;
      },
    },
  };
};

export const methodAdapterToExpress =
  <T>(controller: new (...args: any[]) => T, method: keyof T) =>
  async (req: Request, res: Response) => {
    try {
      const instance = container.resolve(controller);
      const ctx = httpContextAdapter(req, res);
      if (typeof instance[method] === "function") {
        const httpResponse: HttpResponse = await instance[method](ctx);
        if (httpResponse === undefined) {
          return;
        }
        if (!res.headersSent) {
          res.status(httpResponse.statusCode ?? 200).json(httpResponse.data);
        }
      }
    } catch (error) {
      console.error("error:", error);
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(error);
      }
      if (error instanceof ValidationException) {
        return res.status(error.statusCode).json(error.issues);
      }
      return res.status(500).send("Internal server error");
    }
  };

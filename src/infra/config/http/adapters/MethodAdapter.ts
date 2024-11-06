import { HttpException, ValidationException } from "@/app/Exceptions";
import { ErrorHelper } from "@/Helpers/ErrorHelper";
import { HttpContextContract, HttpResponse } from "@/types";
import { unlink } from "fs/promises";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { Constructor } from "@/@types/constructor";

const returnHttpException = (err: HttpException): HttpResponse => ({
  statusCode: err.statusCode,
  data: err.message,
});

const httpContextAdapter = (
  req: Request,
  res: Response,
  next: NextFunction
): HttpContextContract => {
  let responseContext: HttpResponse["responseContext"] = {
    deleteFile: "",
  };
  return {
    response: {
      unauthorized() {
        return {
          statusCode: 401,
          data: {
            message: "Unauthorized",
          },
        };
      },
      unprocessableEntity(error?: any) {
        if (error instanceof HttpException) {
          throw error;
        }
        return error ? { statusCode: 422, data: error } : { statusCode: 422 };
      },
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
            ErrorHelper.sendToLogger(err);
            res.status(500).send("Internal server error");
          }
        });
      },
      ok(data) {
        return { statusCode: 200, data, responseContext };
      },
      created() {
        return { statusCode: 201, responseContext };
      },
      internalServerError(err) {
        return {
          statusCode: 500,
          data: "Internal Server Error",
          responseContext,
        };
      },
      noContent() {
        return { statusCode: 204, responseContext };
      },
      notFound(message) {
        return {
          statusCode: 404,
          data: message,
          responseContext,
        };
      },
      badRequest(error) {
        if (error instanceof HttpException) returnHttpException(error);
        if (typeof error === "string") {
          return {
            statusCode: 400,
            data: error,
            responseContext,
          };
        }
        return {
          statusCode: 400,
          data: "BadRequest",
          responseContext,
        };
      },
    },
    request: {
      files() {
        const files =
          (req.files as Express.Multer.File[]) ?? ([] as Express.Multer.File[]);
        return files;
      },
      file(key: string, options) {
        const file = (req.files as Express.Multer.File[]).find(
          (file) => file.fieldname === key
        );
        if (options?.shouldDelete) {
          responseContext.deleteFile = file?.path;
        }

        return file;
      },
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
  <T>(controller: Constructor<T>, method: keyof T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const instance = container.resolve(controller);
      const ctx = httpContextAdapter(req, res, next);

      if (typeof instance[method] === "function") {
        // @ts-ignore
        const httpResponse: HttpResponse = await instance[method](ctx);
        if (httpResponse?.responseContext?.deleteFile) {
          unlink(httpResponse?.responseContext.deleteFile);
        }

        if (!res.headersSent) {
          res
            .status(httpResponse?.statusCode ?? 200)
            .json(httpResponse?.data ?? {});
        }
      }
    } catch (error) {
      ErrorHelper.sendToLogger(error);
      if (error instanceof HttpException) {
        return res.status(error.statusCode).json(
          error.message
            ? {
                ...error,
                message: error.message,
              }
            : error
        );
      }
      if (error instanceof ValidationException) {
        return res.status(error.statusCode).json({
          message: "Validation error",
          issues: error.issues,
        });
      }
      return res.status(500).send("Internal server error");
    }
  };

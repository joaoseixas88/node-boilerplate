import { ErrorHelper } from '@/Helpers/ErrorHelper';
import { RouterMiddleware } from '@/infra/config/http/adapters/RouteAdapter';
import { NextFunction, Request, Response } from 'express';
import { existsSync, mkdirSync } from 'fs';
import multer from 'multer';

export const multerConfig = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (!existsSync('temp')) mkdirSync('temp');
      cb(null, 'temp/');
    },
    filename: (req, file, cb) => {
      cb(
        null,
        Date.now() + '-' + file.originalname.trim().replaceAll(' ', '_'),
      );
    },
  }),
});

export const multerMiddleware: RouterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const upload = multerConfig.any();
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  } catch (error) {
    ErrorHelper.sendToLogger(error);
  }
};

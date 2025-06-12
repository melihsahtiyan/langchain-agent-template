import { Request, Response, NextFunction } from "express";
import logger from "./loggingHandler";
import OperationalError from "./OperationalError";

const errorHandler = (
  err: OperationalError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const errorResponse = {
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    requestId: req.headers["x-request-id"],
    timestamp: new Date().toISOString(),
  };

  // Log error
  logger.error("Application error:", {
    ...errorResponse,
    path: req.path,
    method: req.method,
    ip: req.ip,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  return res.status(err.statusCode).json(errorResponse);
};

export const errorHandlingMiddleware = (
  err: OperationalError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errorHandler(err, req, res, next);
};

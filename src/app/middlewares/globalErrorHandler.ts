import { NextFunction, Request, Response } from "express";
import httpStatus, { UNAUTHORIZED } from "http-status";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handling Zod validation errors
  console.log(error);
  if (error instanceof ZodError) {
    const issues = error.errors;
    const formattedErrors = issues.map((issue: any) => ({
      field: issue.path.join(""),
      message: issue.message,
    }));
    const errorMessage = formattedErrors
      .map((issue) => issue.message)
      .join(" ");
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: errorMessage,
      errorDetails: { issues: formattedErrors },
    });
  }

  // Handling unauthorized errors
  if (
    error instanceof TokenExpiredError ||
    error instanceof JsonWebTokenError ||
    error.statusCode === 401 // Check if error has status code 401
  ) {
    let errorMessage = "Unauthorized access";
    if (error instanceof TokenExpiredError) {
      errorMessage = "JWT token has expired.";
    } else if (error instanceof JsonWebTokenError) {
      errorMessage = error.message;
    } else if (error.statusCode === 401) {
      errorMessage = error.message || "You are not authorized!";
    }

    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: errorMessage,
      errorDetails: UNAUTHORIZED,
    });
  }
  // Handling other errors
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || "Internal Server Error",
    errorDetails: error,
  });
};

export default globalErrorHandler;

import { isAxiosError } from "axios";
import mongoose from "mongoose";
import { AuthError } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ValidationError, RequestError } from "../http.errors";
import logger from "../logger";

// Types
type ResponseType = "api" | "server";

interface IHandleErrorParams {
  error: unknown;
  responseType?: ResponseType;
}

interface ErrorResponse {
  success: boolean;
  error: {
    details?: Record<string, string[]>;
  };
  message: string;
}

type APIErrorResponse = NextResponse<ErrorResponse>;

// Response formatter
const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]>,
): APIErrorResponse | ErrorResponse => {
  const responseContent: ErrorResponse = {
    success: false,
    error: {
      details: errors,
    },
    message,
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, {
        status,
        headers: { "Content-Type": "application/json" },
      })
    : { status, ...responseContent };
};

// Error handlers
const handleMongoError = (
  error: mongoose.Error,
  responseType: ResponseType,
): APIErrorResponse | ErrorResponse => {
  const errorMessage = error.message.toLowerCase();

  if (
    errorMessage.includes("timeout") ||
    errorMessage.includes("buffering timed out")
  ) {
    return formatResponse(
      responseType,
      503,
      "Database operation timed out. Please try again later.",
    );
  }

  if (
    errorMessage.includes("connection") ||
    errorMessage.includes("buffering")
  ) {
    return formatResponse(
      responseType,
      503,
      "Database connection issue. Please try again later.",
    );
  }

  return formatResponse(
    responseType,
    503,
    "Database error occurred. Please try again later.",
  );
};

const handleRequestError = (
  error: RequestError,
  responseType: ResponseType,
): APIErrorResponse | ErrorResponse => {
  logger.error(
    { err: error },
    `${responseType.toUpperCase()} Error: ${error.message}`,
  );

  return formatResponse(
    responseType,
    error.statusCode,
    error.message,
    error.errors,
  );
};

const handleValidationError = (
  error: ZodError,
  responseType: ResponseType,
): APIErrorResponse | ErrorResponse => {
  const validationError = new ValidationError(
    error.flatten().fieldErrors as Record<string, string[]>,
  );

  logger.error({ err: error }, `Validation Error: ${validationError.message}`);

  return formatResponse(
    responseType,
    validationError.statusCode,
    validationError.message,
    validationError.errors,
  );
};

const handleAxiosError = (
  error: unknown,
  responseType: ResponseType,
): APIErrorResponse | ErrorResponse => {
  if (!isAxiosError(error)) {
    throw new Error("Expected Axios error");
  }

  const statusCode = error.response?.status || 500;
  const message =
    error.response?.data?.message ||
    `Request failed with status code ${statusCode}`;

  return formatResponse(responseType, statusCode, message);
};

const handleAuthError = (
  error: AuthError,
  responseType: ResponseType,
): APIErrorResponse | ErrorResponse => {
  logger.error(`AuthJS Error: ${error.message}`);
  return formatResponse(
    responseType,
    500,
    "Server is down, please try it later",
  );
};

// Main error handler
const handleError = ({
  error,
  responseType = "api",
}: IHandleErrorParams): APIErrorResponse | ErrorResponse => {
  if (error instanceof Error) {
    // MongoDB errors
    if (error.name === "MongooseError") {
      return handleMongoError(error as mongoose.Error, responseType);
    }

    // Request errors
    if (error instanceof RequestError) {
      return handleRequestError(error, responseType);
    }

    // Validation errors
    if (error instanceof ZodError) {
      return handleValidationError(error, responseType);
    }

    // Auth errors
    if (error instanceof AuthError) {
      return handleAuthError(error, responseType);
    }

    // Generic errors
    logger.error(error.message);
    return formatResponse(responseType, 500, error.message);
  }

  // Axios errors
  if (isAxiosError(error)) {
    return handleAxiosError(error, responseType);
  }

  // Unexpected errors
  const defaultMessage = "An unexpected error occurred";
  logger.error({ err: error }, defaultMessage);
  return formatResponse(responseType, 500, defaultMessage);
};

export default handleError;

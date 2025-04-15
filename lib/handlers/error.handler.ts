import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ValidationError, RequestError } from "../http.errors";
import logger from "../logger";

type ResponseType = "api" | "server";

interface IHandleErrorParam {
  error: unknown;
  responseType?: ResponseType;
}

const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined,
) => {
  const responseContent = {
    success: false,
    error: {
      details: errors,
    },
    message,
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status, ...responseContent };
};

const handleError = ({ error, responseType = "api" }: IHandleErrorParam) => {
  // Error from request
  if (error instanceof RequestError) {
    logger.error(
      { err: error },
      `${responseType.toLocaleUpperCase()} Error: ${error.message}`,
    );

    return formatResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors,
    );
  }

  // Error from validate
  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>,
    );

    logger.error(
      { err: error },
      `Validation Error: ${validationError.message}`,
    );

    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors,
    );
  }

  // Error normal
  if (error instanceof Error) {
    logger.error(error.message);
    return formatResponse(responseType, 500, error.message);
  }

  // Error Unexpected
  const errDefaultMessage = "An unexpected error occurred";
  logger.error({ err: error }, errDefaultMessage);
  return formatResponse(responseType, 500, errDefaultMessage);
};

export default handleError;

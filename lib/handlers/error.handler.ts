import { isAxiosError } from "axios";
import { NextResponse } from "next/server";
import { AuthError } from "next-auth";
import { ZodError } from "zod";

import { ValidationError, RequestError } from "../http.errors";
import logger from "../logger";

type ResponseType = "api" | "server";

interface IHandleErrorParams {
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

const handleError = ({
  error,
  responseType = "api",
}: IHandleErrorParams): APIErrorResponse | ErrorResponse => {
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

  // Axios error
  if (isAxiosError(error)) {
    // logger.error(error.response.message as string);
    console.log(error.response?.data, "hello");
    const statusCodeAxios = error.response?.status || 500;
    return formatResponse(
      responseType,
      statusCodeAxios,
      error.response?.data?.message ||
        `Request failed with status code ${statusCodeAxios}`,
    );
  }

  // Sign in Auth error
  if (error instanceof AuthError) {
    logger.error(`Something wrong with AuthJS: ${error.message}`);
    return formatResponse(
      responseType,
      500,
      "Server is down, please try it later",
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

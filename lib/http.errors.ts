import logger from "./logger";

export class RequestError extends Error {
  name: string;

  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string[]>,
  ) {
    logger.error(message);
    super(message);
    this.name = "RequestError";
  }
}

export class ValidationError extends RequestError {
  constructor(public errors: Record<string, string[]>) {
    const message = ValidationError.formatError(errors);
    logger.error(message);
    super(400, message, errors);
    this.name = "ValidationError";
  }

  static formatError(errors: Record<string, string[]>): string {
    const formattedMessage = Object.entries(errors).map(([field, messages]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

      if (messages[0] === "Required") {
        return `${fieldName} is required`;
      } else {
        return messages.join(" and ");
      }
    });

    return formattedMessage.join(", ");
  }
}

export class NotFoundError extends RequestError {
  constructor(resource: string) {
    const message = `${resource} not found`;
    logger.error(message);
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string = "Forbidden") {
    logger.error(message);
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message: string = "Unauthorized") {
    logger.error(message);
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

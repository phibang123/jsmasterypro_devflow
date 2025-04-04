export class RequestError extends Error {
  name: string;

  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "RequestError";
  }
}

export class ValidationError extends RequestError {
  constructor(public errors: Record<string, string[]>) {
    const message = ValidationError.formatError(errors);
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
    super(404, `${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends RequestError {
  constructor() {
    super(402, "Unauthorized");
    this.name = "UnauthorizedError";
  }
}

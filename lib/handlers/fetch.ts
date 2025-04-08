import { ActionResponse } from "@/types/response";

import logger from "../logger";
import handleError from "./error";
import { RequestError } from "../http.errors";

interface FetchOptions extends RequestInit {
  timeOut?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Optional: replace with axios
export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ActionResponse<T>> {
  const {
    timeOut = 5000,
    headers: customerHeader = {},
    ...restOptions
  } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeOut);

  const defaultHeader: HeadersInit = {
    "Content-type": "application/json",
    Accept: "application/json",
  };

  const headers: HeadersInit = {
    ...defaultHeader,
    ...customerHeader,
  };
  const config: RequestInit = {
    ...restOptions,
    ...headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    clearTimeout(id);

    if (!response.ok) {
      throw new RequestError(response.status, `HTTP error: ${response.status}`);
    }

    return (await response.json()) as ActionResponse<T>;
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error");

    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out`);
    } else {
      logger.warn(`Error fetching ${url}: ${error}`);
    }

    return handleError(error) as ActionResponse<T>;
  }
}

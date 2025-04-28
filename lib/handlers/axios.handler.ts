import axios, { AxiosError, AxiosRequestConfig } from "axios";

import logger from "../logger";
import handleError from "./error.handler";

interface FetchOptions extends AxiosRequestConfig {
  timeOut?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

// Optional: replace with fetch
export async function axiosInstance<T>(
  url: string,
  options: FetchOptions = {},
): Promise<APIResponse<T>> {
  const {
    timeOut = 50000,
    headers: customerHeaders = {},
    ...restOptions
  } = options;

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: timeOut,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...customerHeaders,
    },
  });

  try {
    const response = await axiosInstance(url, restOptions);
    return response.data as SuccessResponse<T>;
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error");

    if (axios.isAxiosError(err)) {
      const errorMessage = err.response?.data?.message || err.message;
      return handleError({
        error: new AxiosError(errorMessage),
        responseType: "server",
      }) as APIErrorResponse;
    }

    if (axios.isCancel(err)) {
      logger.warn(`Request to ${url} was cancelled.`);
    } else {
      logger.warn(`Error fetching ${url}: ${error}`);
    }

    return handleError({ error, responseType: "server" }) as APIErrorResponse;
  }
}

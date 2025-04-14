import { NextResponse } from "next/server";

import logger from "../logger";

type ResponseType = "api" | "server";

const handleSuccess = <T = unknown>(
  data: T,
  status: number = 200,
  responseType: ResponseType = "api",
): APIResponse | SuccessResponse<T> => {
  logger.info(`Data Success: ${data}, Status: ${status}`);
  const response: SuccessResponse<T> = {
    success: true,
  };
  if (data) response.data = data;

  return responseType === "api"
    ? NextResponse.json(response, { status })
    : response;
};

export default handleSuccess;

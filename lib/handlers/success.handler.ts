import { NextResponse } from 'next/server';

import logger from '../logger';

type ResponseType = 'api' | 'server';

interface IHandleSuccessParams<T = unknown> {
  data?: T;
  status?: number;
  message?: string;
  responseType?: ResponseType;
}

const handleSuccess = <T = unknown>({
  data,
  status = 200,
  responseType = 'api',
  message = 'Success',
}: IHandleSuccessParams<T>): APISuccessResponse<T> | SuccessResponse<T> => {
  logger.info(`Data Success, Status: ${status}, Response Type: ${responseType}`);
  const response: SuccessResponse<T> = {
    data,
    success: true,
    status,
    message,
  };

  return responseType === 'api'
    ? NextResponse.json(response, {
        status,
        headers: { 'Content-Type': 'application/json' },
      })
    : response;
};

export default handleSuccess;

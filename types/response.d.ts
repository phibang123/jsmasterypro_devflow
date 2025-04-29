type DefaultResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    details: Record<string, string[]>;
  };
  message: string;
  status?: number;
};

type SuccessResponse<T = unknown> = DefaultResponse<T> & { success: true };
type ErrorResponse = DefaultResponse & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APISuccessResponse<T = unknown> = NextResponse<SuccessResponse<T>>;
type APIResponse<T = unknown> = NextResponse<SuccessResponse<T> | ErrorResponse>;

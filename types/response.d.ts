type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: {
    details: Record<string, string[]>;
  };
  message: string;
  status?: number;
};

type SuccessResponse<T = unknown> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APISuccessResponse<T = unknown> = NextResponse<SuccessResponse<T>>;
type APIResponse<T = unknown> = NextResponse<
  SuccessResponse<T> | ErrorResponse
>;

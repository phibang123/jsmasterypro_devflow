type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    details: Record<string, string[]>;
  };
  message: string;
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

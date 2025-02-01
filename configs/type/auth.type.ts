import { FieldValues } from "react-hook-form";
import { ZodType } from "zod";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValue: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  formType: "SIGN_UP" | "SIGN_IN";
}

export type { AuthFormProps };

import { Session } from "next-auth";
import { z } from "zod";

import { auth } from "@/auth";

import { UnauthorizedError, ValidationError } from "../http.errors";

type IActionOptions<T> = {
  params?: T;
  schema?: z.ZodObject<Record<string, z.ZodType>>;
  authorize?: boolean;
  partial?: boolean;
};

// 1.Checking whether the schema and params are provided and validated.
// 2.Checking whether the user is authorized.
// 3.Connect to the data base. ??? Optional
// 4.Return params and session
async function GuardGateway<T>({
  params,
  schema,
  authorize,
  partial,
}: IActionOptions<T>) {
  if (schema && params) {
    const result = partial
      ? schema.partial().safeParse(params)
      : schema.safeParse(params);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      throw new ValidationError(fieldErrors as Record<string, string[]>);
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session || !session.user || !session.user.id) {
      throw new UnauthorizedError();
    }
  }
  return { params, session };
}

export default GuardGateway;

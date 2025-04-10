"user server";

import { Session } from "next-auth";
import { ZodError, ZodSchema } from "zod";

import { auth } from "@/auth";

import { UnauthorizedError, ValidationError } from "../http.errors";
import dbConnect from "../mongoose";

type IActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

// 1.Checking whether the schema and params are provided and validated.
// 2.Checking whether the user is authorized.
// 3.Connect to the data base.
// 4.Return params and session
async function action<T>({ params, schema, authorize }: IActionOptions<T>) {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>,
        );
      }
      return new Error("Schema validation filed");
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session) {
      return new UnauthorizedError();
    }
  }

  // optional
  await dbConnect();

  return { params, session };
}

export default action;

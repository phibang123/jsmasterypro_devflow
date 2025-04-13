"use server";

import { signIn } from "@/auth";

import { constructorApi } from "../api";
import handleError from "../handlers/error.handler";
import GuardGateway from "../handlers/guard.handler";
import { SignUpSchema } from "../validations";

export async function signUpWithCredentials(params: IAuthCredentials) {
  const validationResult = await GuardGateway({
    params,
    schema: SignUpSchema,
  });

  if (validationResult instanceof Error || !validationResult.params) {
    return handleError(validationResult) as ErrorResponse;
  }
  try {
    const response = await constructorApi.auth.credentialSignUp(
      validationResult.params,
    );
    if (response.success) {
      const { email, password } = validationResult.params;
      await signIn("credentials", { email, password, redirect: false });
    }
    return response;
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

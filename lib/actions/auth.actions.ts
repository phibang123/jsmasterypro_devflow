"use server";

import { signIn, signOut } from "@/auth";

import { constructorApi } from "../api";
import handleError from "../handlers/error.handler";
import GuardGateway from "../handlers/guard.handler";
import handleSuccess from "../handlers/success.handler";
import { SignInSchema, SignUpSchema } from "../validations";

export async function signUpWithCredentials(params: IAuthCredentials) {
  const validationResult = await GuardGateway({
    params,
    schema: SignUpSchema,
  });

  if (validationResult instanceof Error || !validationResult.params) {
    return handleError({ error: validationResult, responseType: "server" });
  }
  try {
    const response = await constructorApi.auth.credentialsSignUp(
      validationResult.params,
    );
    if (!response.success || !response.data) return response;
    const { id, image, name, email } = response.data;
    await signIn("credentials", {
      userDefined: JSON.stringify({ id, image, name, email }),
      redirect: false,
    });
    return handleSuccess({ message: response.message, responseType: "server" });
  } catch (error) {
    return handleError({ error, responseType: "server" });
  }
}

export async function signInWithCredentials(
  params: Pick<IAuthCredentials, "email" | "password">,
) {
  const validationResult = await GuardGateway({
    params,
    schema: SignInSchema,
  });

  if (validationResult instanceof Error || !validationResult.params) {
    return handleError({ error: validationResult, responseType: "server" });
  }

  try {
    const response = await constructorApi.auth.credentialsSignIn(params);
    if (!response.success || !response.data) return response;
    const { id, email, image, name } = response.data;

    await signIn("credentials", {
      userDefined: JSON.stringify({ id, image, name, email }),
      redirect: false,
    });
    return handleSuccess({ message: response.message, responseType: "server" });
  } catch (error) {
    return handleError({ error, responseType: "server" });
  }
}

export async function logoutWithCredentials() {
  // Doesn't use trycatch
  await signOut();
}

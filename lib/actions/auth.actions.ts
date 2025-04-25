"use server";

import { signIn, signOut } from "@/auth";

import { constructorApi } from "../api";
import handleError from "../handlers/error.handler";
import GuardGateway from "../handlers/guard.handler";
import handleSuccess from "../handlers/success.handler";
import { SignUpSchema, SignInSchema } from "../validations/index";

export async function signUpWithCredentials(params: IAuthCredentials) {
  try {
    const validationResult = await GuardGateway({
      params,
      schema: SignUpSchema,
    });
    const validatedParams = validationResult.params!;
    const response =
      await constructorApi.auth.credentialsSignUp(validatedParams);
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
  try {
    const validationResult = await GuardGateway({
      params,
      schema: SignInSchema,
    });
    const validatedParams = validationResult.params!;
    const response =
      await constructorApi.auth.credentialsSignIn(validatedParams);
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

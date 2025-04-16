"use client";
import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { SIGN_IN } from "@/configs/constance";
import { signInWithCredentials } from "@/lib/actions/auth.actions";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <AuthForm
      formType={SIGN_IN}
      schema={SignInSchema}
      defaultValue={{ email: "", password: "" }}
      onSubmit={signInWithCredentials}
    />
  );
};

export default SignIn;

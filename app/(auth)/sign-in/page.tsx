"use client";
import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { FormType } from "@/configs/hardcode/auth.hardcode";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <AuthForm
      formType={FormType.SIGN_IN}
      schema={SignInSchema}
      defaultValue={{ username: "", password: "" }}
      onSubmit={(data) => Promise.resolve({ success: true, data })}
    />
  );
};

export default SignIn;

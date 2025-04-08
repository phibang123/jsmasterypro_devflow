"use client";

import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { SIGN_UP } from "@/configs/constance";
import { SignUpSchema } from "@/lib/validations";

const SignUp = () => {
  return (
    <AuthForm
      formType={SIGN_UP}
      schema={SignUpSchema}
      defaultValue={{ email: "", password: "", name: "", username: "" }}
      onSubmit={(data) => Promise.resolve({ success: true, data })}
    />
  );
};

export default SignUp;

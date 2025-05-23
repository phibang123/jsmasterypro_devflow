'use client';
import React from 'react';

import AuthForm from '@/components/forms/AuthForm';
import { SIGN_IN } from '@/constants';
import { signInWithCredentials } from '@/lib/actions/auth.actions';
import { SignInSchema } from '@/lib/validations/index';

const SignInPage = () => {
  return (
    <AuthForm
      formType={SIGN_IN}
      schema={SignInSchema}
      defaultValue={{ email: '', password: '' }}
      onSubmit={signInWithCredentials}
    />
  );
};

export default SignInPage;

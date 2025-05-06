'use client';

import React from 'react';

import AuthForm from '@/components/forms/AuthForm';
import { SIGN_UP } from '@/constants';
import { signUpWithCredentials } from '@/lib/actions/auth.actions';
import { SignUpSchema } from '@/lib/validations/index';

const SignUpPage = () => {
  return (
    <AuthForm
      formType={SIGN_UP}
      schema={SignUpSchema}
      defaultValue={{ email: '', password: '', name: '', username: '' }}
      onSubmit={signUpWithCredentials}
    />
  );
};

export default SignUpPage;

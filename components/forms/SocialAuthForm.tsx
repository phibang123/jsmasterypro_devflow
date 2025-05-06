'use client';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import React from 'react';

import { ROUTES } from '@/constants';
import { toast } from '@/hooks/use-toast';

import { Button } from '../ui/button';

const storeSocialAuth = [
  {
    image: '/icons/github.svg',
    title: 'Login with Github',
    classEx: 'invert-colors',
    provider: 'github',
  },
  {
    image: '/icons/google.svg',
    title: 'Login with Google',
    classEx: '',
    provider: 'google',
  },
];

const SocialAuthForm = () => {
  const handleSignInGithub = async (provider: 'github' | 'google') => {
    try {
      await signIn(provider, {
        redirectTo: ROUTES.HOME,
        redirect: false,
      });
    } catch (error) {
      toast({
        title: 'Sign-in Failed',
        description: error instanceof Error ? error.message : 'An error occurred during sign-in',
        variant: 'destructive',
      });
    }
  };

  const buttonClass =
    'background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5 w-full';

  return (
    <div className="mt-10 flex w-full flex-wrap items-center justify-around gap-2">
      {storeSocialAuth.map(({ image, title, classEx, provider }, key) => {
        return (
          <Button
            key={`SocialAuthForm_${Math.random}_${key}`}
            className={buttonClass}
            onClick={() => handleSignInGithub(provider === 'github' ? 'github' : 'google')}
          >
            <Image
              src={image}
              width={20}
              height={20}
              alt="Github logo"
              className={`${classEx} mr-2.5 object-contain`}
            />
            <span>{title}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default SocialAuthForm;

import Image from "next/image";
import React, { ReactNode } from "react";

import SocialAuthForm from "@/components/forms/SocialAuthForm";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <main className="flex-center min-h-screen bg-auth-light bg-cover bg-center bg-no-repeat px-4 py-10 dark:bg-auth-dark">
      <section className="light-border background-light800_dark200 shadow-light100_dark100 min-w-full rounded-[10px] border px-4 py-10 shadow-sm sm:min-w-[520px] sm:px-8">
        <div className="flex-between gap-2">
          <div className="space-y-2.5">
            <h1 className="h2-bold text-dark100_light900">Join DevFlow</h1>
            <p className="paragraph-regular text-dark500_light400">
              To get your questions answered
            </p>
          </div>
          <Image
            src="/images/site-logo.svg"
            alt="DevFlow Logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </div>
        {children}
        <SocialAuthForm />
      </section>
    </main>
  );
};

export default AuthLayout;

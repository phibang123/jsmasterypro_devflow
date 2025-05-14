import React, { ReactNode } from 'react';

import LeftSidebar from '@/components/navigation/LeftSidebar';
import Navbar from '@/components/navigation/navbar';
import RightSidebar from '@/components/navigation/RightSidebar';
import CookieConsent from '@/components/popup/CookieConsent';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <main className="background-light850_dark100 relative">
      <Navbar />

      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-4 pb-6 pt-32 max-md:pb-14 sm:px-6">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSidebar />
      </div>
      <CookieConsent />
    </main>
  );
};

export default RootLayout;

import { LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ROUTES } from '@/constants';
import { logoutWithCredentials } from '@/lib/actions/auth.actions';

import NavLinks from './NavLinks';

const MobileNavigation = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  const renderLoginLogout = () => {
    if (userId) {
      return (
        <div className="flex flex-col gap-3">
          <SheetClose asChild>
            <form action={logoutWithCredentials}>
              <Button
                type="submit"
                className="base-medium w-fit !bg-transparent px-4 py-3"
              >
                <LogOut className="size-5 text-black dark:text-white" />
                <span className="text-dark300_light900">Log out</span>
              </Button>
            </form>
          </SheetClose>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-3">
        <SheetClose asChild>
          <Link href={ROUTES.SIGN_IN}>
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <span className="primary-text-gradient">Log In</span>
            </Button>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link href={ROUTES.SIGN_UP}>
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
              <span className="primary-text-gradient">Sign Up</span>
            </Button>
          </Link>
        </SheetClose>
      </div>
    );
  };

  return (
    <Sheet>
      <SheetTrigger
        className="cursor-pointer"
        asChild
      >
        <Image
          src="/icons/hamburger.svg"
          width={36}
          height={36}
          alt="Menu"
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 border-none"
      >
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <Link
          href="/"
          className="flex items-center gap-1"
        >
          <Image
            src="/images/site-logo.svg"
            width={32}
            height={32}
            alt="Logo"
          />
          <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900">
            Dev <span className="text-primary-500">Flow</span>
          </p>
        </Link>
        <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
          <SheetClose asChild>
            <section className="flex h-full flex-col gap-6 pt-16">
              <NavLinks isMobileNav={true} />
            </section>
          </SheetClose>
          {renderLoginLogout()}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;

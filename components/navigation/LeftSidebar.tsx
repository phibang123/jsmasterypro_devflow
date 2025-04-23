import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { auth } from "@/auth";
import ROUTES from "@/constants/routes";
import { logoutWithCredentials } from "@/lib/actions/auth.actions";

import NavLinks from "./navbar/NavLinks";
import { Button } from "../ui/button";

const LeftSidebar = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  const renderLoginLogout = () => {
    if (userId) {
      return (
        <form action={logoutWithCredentials}>
          <Button
            type="submit"
            className="base-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
          >
            <LogOut className="size-5 text-black dark:text-white" />
            <span className="text-dark300_light900 max-lg:hidden">Log out</span>
          </Button>
        </form>
      );
    }
    return (
      <>
        <Button
          className="base-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
          asChild
        >
          <Link href={ROUTES.SIGN_IN}>
            <Image
              src="/icons/account.svg"
              alt="Account"
              width={20}
              height={20}
              className="invert-colors"
            />
            <span className="text-dark300_light900 max-lg:hidden">Log In</span>
          </Link>
        </Button>

        <Button
          className="base-medium light-border-2 btn-tertiary text-dark400_light900 primary-gradient min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none "
          asChild
        >
          <Link href={ROUTES.SIGN_UP}>
            <Image
              src="/icons/sign-up.svg"
              alt="Account"
              width={20}
              height={20}
              className="text-light-900"
            />
            <span className="text-light-900 max-lg:hidden">Sign Up</span>
          </Link>
        </Button>
      </>
    );
  };

  return (
    <section className="custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r border-none p-6 pr-2 pt-32 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[300px]">
      <div className="background-light800_dark300 flex flex-col gap-4 rounded-lg p-6 shadow-light-300 dark:shadow-none">
        <NavLinks userId={userId} />
      </div>

      <div className="mt-5 flex flex-col gap-3">{renderLoginLogout()}</div>
    </section>
  );
};

export default LeftSidebar;

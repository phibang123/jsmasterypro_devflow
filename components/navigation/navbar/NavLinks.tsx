"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";

interface NavLinksProp {
  isMobileNav?: boolean;
}

const NavLinks: React.FC<NavLinksProp> = ({ isMobileNav = false }) => {
  const pathName = usePathname();
  const userId = 1;

  const renderingNavLink = () => {
    return sidebarLinks.map((item) => {
      const isActive =
        (pathName.includes(item.route) && item.route.length > 1) ||
        pathName === item.route;
      if (item.route === "/profile") {
        if (userId) item.route = `${item.route}/${userId}`;
        else return null;
      }

      const LinkComponent = (
        <Link
          className={cn(
            isActive
              ? "primary-gradient rounded-lg text-light-900"
              : "text-dark300_light900",
            "flex items-center justify-start gap-4 bg-transparent p-4",
          )}
          href={item.route}
          key={item.label}
        >
          <Image
            className={cn({ "invert-colors": !isActive })}
            src={item.imgURL}
            alt={item.label}
            width={20}
            height={20}
          />
          <p
            className={cn(
              isActive ? "base-bold" : "base-medium",
              !isMobileNav && "max-lg:hidden",
            )}
          >
            {item.label}
          </p>
        </Link>
      );
      return isMobileNav ? (
        <SheetClose asChild key={item.route}>
          {LinkComponent}
        </SheetClose>
      ) : (
        <React.Fragment key={item.route}>{LinkComponent}</React.Fragment>
      );
    });
  };

  return <>{renderingNavLink()}</>;
};

export default NavLinks;

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { SheetClose } from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

interface NavLinksProp {
  isMobileNav?: boolean;
  userId?: string;
}

const NavLinks: React.FC<NavLinksProp> = ({ isMobileNav = false, userId }) => {
  const pathName = usePathname();

  const renderingNavLink = () => {
    return sidebarLinks.map((item) => {
      const isActive =
        (pathName.includes(item.route) && item.route.length > 1) || pathName === item.route;

      // Skip profile link if no userId
      if (item.route === '/profile' && !userId) return null;

      const route = item.route === '/profile' ? `${item.route}/${userId}` : item.route;

      const LinkComponent = (
        <Link
          className={cn(
            isActive ? 'primary-button-gradient base-medium rounded-lg' : 'text-dark300_light900',
            'flex items-center justify-start gap-4 bg-transparent p-2',
          )}
          href={route}
          key={item.label}
        >
          <Image
            className={cn({ 'invert-colors': !isActive })}
            src={item.imgURL}
            alt={item.label}
            width={20}
            height={20}
          />
          <p
            className={cn(isActive ? 'base-bold' : 'base-medium', !isMobileNav && 'max-lg:hidden')}
          >
            {item.label}
          </p>
        </Link>
      );
      return isMobileNav ? (
        <SheetClose
          asChild
          key={item.route}
        >
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

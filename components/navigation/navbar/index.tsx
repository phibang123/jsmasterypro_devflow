import React from 'react';

import Logo from '@/components/ui/logo';
import UserAvatar from '@/components/UserAvatar';

import MobileNavigation from './MobileNavigation';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 rounded-b-lg p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Logo />
      <p>Global Search</p>
      <div className="flex-between gap-5">
        <ThemeToggle />
        <UserAvatar />
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;

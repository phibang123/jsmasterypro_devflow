import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-1">
      <Image
        src="/images/site-logo.svg"
        width={23}
        height={23}
        alt="DevFlow Logo"
      />
      <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
        Dev <span className="text-primary-500">Flow.</span>
      </p>
    </Link>
  );
};
export default Logo;

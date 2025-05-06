import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { auth } from '@/auth';
import { ROUTES } from '@/constants';

import { Avatar, AvatarFallback } from './ui/avatar';

const UserAvatar = async ({ className = 'h-9 w-9' }: { className?: string }) => {
  const session = await auth();
  const userSession = session?.user;
  if (!userSession) return;
  const { id, image, name } = userSession;
  const initials = name
    ?.split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const imageDefault = () =>
    image ? (
      <Image
        src={image}
        alt={name!}
        width={36}
        height={36}
        className="bg-light-400 object-cover dark:bg-dark-500"
        quality={100}
      />
    ) : (
      <AvatarFallback className="primary-gradient font-space-grotesk font-bold tracking-wider text-white">
        {initials}
      </AvatarFallback>
    );

  return (
    <Link href={ROUTES.PROFILE(id!)}>
      <Avatar className={className}>{imageDefault()}</Avatar>
    </Link>
  );
};

export default UserAvatar;

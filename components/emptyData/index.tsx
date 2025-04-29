'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DEFAULT_EMPTY, STAGE_LADING_PAGE } from '@/constants/states';

const SkeletonEmptyData = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const formattedPathname = `/${pathname.split('/')[1]}`;

  let emptyConfig = DEFAULT_EMPTY;
  if (formattedPathname in STAGE_LADING_PAGE.EMPTY) {
    emptyConfig =
      STAGE_LADING_PAGE.EMPTY[formattedPathname as keyof typeof STAGE_LADING_PAGE.EMPTY];
  }

  const [mounted, setMounted] = useState(false);

  const emptyImage =
    theme === 'dark' ? '/images/dark-illustration.png' : '/images/light-illustration.png';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const errorMessage =
    emptyConfig.message || 'An unexpected error occurred. Please try again later.';

  return (
    <div className={`mt-4 flex h-auto justify-center transition-colors duration-500`}>
      <motion.div
        initial={{ opacity: 1, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.1 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
          }}
        >
          <div className="flex w-full items-center justify-center">
            <Image
              src={emptyImage}
              alt="empty"
              width={270}
              height={270}
              className="block object-contain"
            />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`h2-bold text-dark200_light900`}
        >
          {emptyConfig.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`body-regular my-3.5 max-w-md text-center text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {errorMessage}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href={emptyConfig.button.href}>
            <Button
              size="lg"
              className="primary-button-gradient base-medium min-h-[40px] font-medium !text-light-900"
            >
              <span className="flex items-center gap-2">{emptyConfig.button.text}</span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SkeletonEmptyData;

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DEFAULT_ERROR, STAGE_LADING_PAGE } from '@/constants/states';

export default function SkeletonError() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const formattedPathname = `/${pathname.split('/')[1]}`;

  let errorConfig = DEFAULT_ERROR;
  if (formattedPathname in STAGE_LADING_PAGE.ERROR) {
    errorConfig =
      STAGE_LADING_PAGE.ERROR[formattedPathname as keyof typeof STAGE_LADING_PAGE.ERROR];
  }

  const [mounted, setMounted] = useState(false);

  const errorImage = theme === 'dark' ? '/images/dark-error.png' : '/images/light-error.png';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex h-auto justify-center transition-colors duration-500 `}>
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
              src={errorImage}
              alt="error"
              width={350}
              height={350}
            />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`h2-bold text-dark200_light900`}
        >
          {errorConfig.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`body-regular my-3.5 max-w-md text-center text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {errorConfig.message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center"
        >
          <Button
            onClick={() => window.location.reload()}
            size="lg"
            className="primary-button-gradient base-medium min-h-[40px] font-medium !text-light-900"
          >
            Try again
          </Button>
          <Link href={errorConfig.button.href}>
            <Button
              size="lg"
              className="secondary-button-gradient base-medium min-h-[40px] font-medium"
            >
              <span className="flex items-center gap-2">{errorConfig.button.text}</span>
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Error code: {Math.random().toString(36).substring(2, 15)}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

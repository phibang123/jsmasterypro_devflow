'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const errorImage = theme === 'dark' ? '/images/dark-error.png' : '/images/light-error.png';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex h-screen justify-center transition-colors duration-500 `}>
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
              width={400}
              height={400}
            />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-dark500_light700 text-3xl font-semibold`}
        >
          Oops! Something went wrong!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mx-auto max-w-md text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {error.message || 'An unexpected error occurred. Please try again later.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button
            onClick={reset}
            size="lg"
            className="primary-button-gradient base-medium min-h-[50px] font-medium !text-light-900"
          >
            Try again
          </Button>
          <Link href="/">
            <Button
              size="lg"
              className="secondary-button-gradient base-medium min-h-[50px] font-medium"
            >
              Go back home
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
            Error code: {error.digest || 'Unknown'}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

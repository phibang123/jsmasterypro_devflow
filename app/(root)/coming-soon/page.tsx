'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export default function ComingSoon() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen justify-center transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <h1
            className={`bg-gradient-to-r from-[#328E6E] via-[#67AE6E] to-[#90C67C] bg-clip-text text-9xl font-bold text-transparent`}
          >
            In the near future!
          </h1>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-4xl font-semibold ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}
        >
          Stay tuned for updates!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mx-auto max-w-md text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          We&apos;re working hard to bring you something amazing. Stay tuned for updates!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/">
            <Button
              size="lg"
              className="primary-button-gradient base-medium min-h-[50px] font-medium"
            >
              Go back home
            </Button>
          </Link>
          <Button
            size="lg"
            className="secondary-button-gradient base-medium min-h-[50px] font-medium shadow"
          >
            Notify me
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Estimated launch: Q{new Date().getMonth() + 3} {new Date().getFullYear()}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center bg-light-900 px-4 transition-colors duration-300 dark:bg-dark-300`}
    >
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
            404
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
          Oops! Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mx-auto max-w-md text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-8"
        >
          <Link href="/">
            <button
              className={`inline-flex items-center rounded-lg border-transparent bg-gradient-to-r from-[#328E6E] via-[#67AE6E] to-[#90C67C] px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#328E6E] focus:ring-offset-2`}
            >
              Go back home
            </button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        ></motion.div>
      </motion.div>
    </div>
  );
}

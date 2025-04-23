"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <h1
            className={`bg-gradient-to-r from-[#328E6E] via-[#67AE6E] to-[#90C67C] bg-clip-text text-9xl font-bold text-transparent`}
          >
            Oops!
          </h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-4xl font-semibold ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Something went wrong!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mx-auto max-w-md text-lg ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {error.message ||
            "An unexpected error occurred. Please try again later."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4 pt-8 sm:flex-row sm:justify-center"
        >
          <button
            onClick={reset}
            className={`inline-flex items-center rounded-lg border-transparent bg-gradient-to-r from-[#328E6E] via-[#67AE6E] to-[#90C67C] px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#328E6E] focus:ring-offset-2`}
          >
            Try again
          </button>
          <Link
            href="/"
            className={`inline-flex items-center rounded-lg  border-[#328E6E] bg-transparent px-8 py-4 text-lg font-medium text-[#328E6E] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#328E6E] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#328E6E] focus:ring-offset-2`}
          >
            Go back home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Error code: {error.digest || "Unknown"}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

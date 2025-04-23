"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Loading = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`flex min-h-screen w-full items-center justify-center bg-light-900 px-4 transition-colors duration-300 dark:bg-dark-300`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="flex flex-col items-center gap-8"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <Loader2 className="size-16 bg-gradient-to-r from-[#328E6E] via-[#67AE6E] to-[#90C67C] bg-clip-text text-transparent" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-gradient-to-r from-[#328E6E] via-[#67AE6E] to-[#90C67C] bg-clip-text text-4xl font-bold text-transparent`}
        >
          Loading...
        </motion.h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="h-1.5 w-48 rounded-full bg-gradient-to-r from-[#328E6E] via-[#67AE6E] to-[#90C67C]"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-lg ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Please wait while we prepare your experience
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loading;

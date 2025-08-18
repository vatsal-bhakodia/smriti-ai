import React from "react";
import { motion } from "framer-motion";

const LeftSidePanel = () => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center h-[600px] bg-gray-50 dark:bg-[#111] p-6 text-center overflow-hidden">
      <img
        src="/brain.png"
        alt="AI Learning Brain"
        className="object-contain w-64 h-64 mx-auto opacity-75 mb-6"
      />
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300"
      >
        Smriti AI
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-sm text-gray-700 dark:text-gray-300 max-w-xs mx-auto"
      >
        Sign in to access your personal learning dashboard and track your progress with Smriti AI
      </motion.p>
    </div>
  );
};

export default LeftSidePanel;

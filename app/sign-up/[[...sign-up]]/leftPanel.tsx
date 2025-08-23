import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// The JSX for the left side of the sign-in card
const LeftSidePanel = () => {
    return (
        <div className="hidden lg:block h-[600px] relative overflow-hidden ">
    
                <Image
                    src="/brain.png"
                    alt="AI Learning Brain"
                    width={100}
                    height={100}
                    className="object-contain w-100 h-100 mx-auto mt-10 opacity-75 "
                />
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="text-4xl font-bold mb-2 text-center text-transparent bg-clip-text bg-white"
                >
                    Smriti AI
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-sm text-center bg-clip-text text-gray-300 max-w-xs mx-auto"
                >
                    Sign in to access your personal learning dashboard and track your progress with Smriti AI
                </motion.p>
            </div>
        
    );
};

export default LeftSidePanel;
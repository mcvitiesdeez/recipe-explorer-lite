"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[#e63946] hover:text-white rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 right-0 h-full w-64 bg-[#ffe6a7] shadow-lg z-50 p-4"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[#e63946] hover:text-white rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <Link
                href="/"
                className="text-xl font-bold hover:text-[#e63946] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-xl font-bold hover:text-[#e63946] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/recipe"
                className="text-xl font-bold hover:text-[#e63946] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Recipes
              </Link>
              <Link
                href="/feedback"
                className="text-xl font-bold hover:text-[#e63946] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Feedback
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

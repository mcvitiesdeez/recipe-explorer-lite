"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const techStackVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.h1
        variants={itemVariants}
        className="text-4xl sm:text-5xl font-bold mb-12 text-center"
      >
        About Recipe Explorer
      </motion.h1>

      {/* Tech Stack Section */}
      <motion.div variants={itemVariants} className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Our Tech Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 justify-items-center">
          {[
            {
              href: "https://nextjs.org",
              src: "/images/nextjs.svg",
              alt: "Next.js",
            },
            {
              href: "https://www.typescriptlang.org",
              src: "/images/typescript-icon.svg",
              alt: "TypeScript",
            },
            {
              href: "https://react.dev",
              src: "/images/react.svg",
              alt: "React",
            },
            {
              href: "https://tailwindcss.com",
              src: "/images/tailwindcss-icon.svg",
              alt: "Tailwind CSS",
            },
          ].map((tech) => (
            <motion.div
              key={tech.alt}
              variants={techStackVariants}
              whileHover={{ scale: 1.15 }}
              className="flex justify-center"
            >
              <Link
                href={tech.href}
                target="_blank"
                className="transition-transform"
              >
                <Image
                  src={tech.src}
                  alt={tech.alt}
                  width={120}
                  height={120}
                  className={tech.alt === "React" ? "animate-spin-slow" : ""}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Introduction Section */}
      <motion.div variants={itemVariants} className="mb-16">
        <p className="text-xl leading-relaxed max-w-2xl mx-auto">
          Welcome to Recipe Explorer Lite, a modern recipe discovery platform
          powered by TheMealDB API. Built with cutting-edge technologies
          including Next.js 15, TypeScript, React Query, and Tailwind CSS, our
          application delivers a responsive and user-friendly recipe browsing
          experience.
        </p>
      </motion.div>

      {/* Feature Image Section */}
      <motion.div variants={itemVariants} className="mb-16">
        <Image
          src="/images/libraryFoodRecipe.png"
          alt="Library of Food Recipes"
          width={600}
          height={300}
          className="rounded-xl w-full mx-auto shadow-lg"
        />
      </motion.div>

      {/* Core Features Section */}
      <motion.div variants={itemVariants} className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Core Features
        </h2>
        <ul className="space-y-4 max-w-2xl mx-auto">
          {[
            "Comprehensive recipe database powered by TheMealDB",
            "Detailed recipe pages with ingredients, instructions, and images",
            "Interactive recipe feedback system with ratings and comments",
            "Responsive design that works seamlessly across all devices",
          ].map((feature, index) => (
            <motion.li
              key={index}
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="text-lg leading-relaxed px-4"
            >
              {feature}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Key Functionalities Section */}
      <motion.div variants={itemVariants} className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Key Functionalities
        </h2>
        <div className="grid gap-8 max-w-2xl mx-auto">
          {[
            {
              title: "Recipe Navigation",
              description:
                "Browse through an extensive collection of recipes with easy-to-use pagination",
            },
            {
              title: "Community Engagement",
              description:
                "Share your cooking experiences through ratings and reviews, with paginated feedback display",
            },
            {
              title: "Recipe Details",
              description:
                "Access comprehensive recipe information including ingredients, instructions, and high-quality images",
            },
            {
              title: "User Interface",
              description:
                "Enjoy a modern, responsive design with smooth animations and transitions",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white/50 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-lg leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Culinary Jokes Section */}
      <motion.div variants={itemVariants} className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Culinary Jokes
        </h2>
        <ul className="space-y-6 max-w-2xl mx-auto">
          {[
            "Why did the cookie go to the doctor? Because it was feeling crumbly!",
            "What did the piece of bread say on vacation? This is the best thing since... me!",
            "Why don't eggs tell jokes? They'd crack up!",
            "What do you call a fake noodle? An impasta!",
          ].map((joke, index) => (
            <motion.li
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-lg italic bg-white/30 p-4 rounded-lg"
            >
              {joke}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Closing Statement */}
      <motion.p
        variants={itemVariants}
        className="text-xl leading-relaxed max-w-2xl mx-auto"
      >
        Whether you&apos;re searching for new recipes or want to share your
        culinary experiences, Recipe Explorer Lite provides the perfect platform
        for your cooking journey.
      </motion.p>
    </motion.div>
  );
}

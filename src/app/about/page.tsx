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
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-6">
        About Recipe Explorer
      </motion.h1>

      <div>
        <motion.div
          className="flex justify-center items-center gap-12 mb-12"
          variants={containerVariants}
        >
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
              transition={{ type: "spring", stiffness: 300 }}
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
        </motion.div>

        <motion.p variants={itemVariants} className="text-lg mb-6">
          Welcome to Recipe Explorer Lite, a modern recipe discovery platform
          powered by TheMealDB API. Built with cutting-edge technologies
          including Next.js 15, TypeScript, React Query, and Tailwind CSS, our
          application delivers a responsive and user-friendly recipe browsing
          experience.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-row justify-between items-center mb-6 text-right pr-6"
        >
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <Image
              src="/images/libraryFoodRecipe.png"
              alt="Library of Food Recipes"
              width={300}
              height={150}
              className="rounded-xl"
            />
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Core Features</h2>
            <ul className="list-disc marker:ml-auto" dir="rtl">
              {[
                "Comprehensive recipe database powered by TheMealDB",
                "Detailed recipe pages with ingredients, instructions, and images",
                "Interactive recipe feedback system with ratings and comments",
                "Responsive design that works seamlessly across all devices",
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="mb-2 ml-6"
                >
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Key Functionalities</h2>
          <ul className="list-disc pl-6">
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
              <motion.li
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="mb-2"
              >
                <span className="font-semibold">{item.title}:</span>{" "}
                {item.description}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-right">
            Culinary Jokes
          </h2>
          <ul className="list-disc marker:ml-auto" dir="rtl">
            {[
              "!Because it was feeling crumbly ?Why did the cookie go to the doctor",
              "!This is the best thing since... me ?What did the piece of bread say on vacation",
              "!They'd crack up ?Why don't eggs tell jokes",
              "!An impasta ?What do you call a fake noodle",
            ].map((joke, index) => (
              <motion.li
                key={index}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="mb-2 ml-6"
              >
                {joke}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.p variants={itemVariants} className="text-lg">
          Whether you&apos;re searching for new recipes or want to share your
          culinary experiences, Recipe Explorer Lite provides the perfect
          platform for your cooking journey.
        </motion.p>
      </div>
    </motion.div>
  );
}

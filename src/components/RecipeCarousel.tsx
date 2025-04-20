"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRandomMeals } from "@/utils/api";
import LoadingSpinner from "./LoadingSpinner";

export default function RecipeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["carousel-recipes"],
    queryFn: () => getRandomMeals(10),
  });

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (recipes?.length || 1));
    }, 5000);
  };

  useEffect(() => {
    if (!recipes) return;

    resetTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recipes]);

  if (isLoading || !recipes) return <LoadingSpinner />;

  const currentRecipe = recipes[currentIndex];
  const prevRecipe =
    recipes[(currentIndex - 1 + recipes.length) % recipes.length];
  const nextRecipe = recipes[(currentIndex + 1) % recipes.length];

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (!recipes) return prevIndex;
      if (newIndex < 0) newIndex = recipes.length - 1;
      if (newIndex >= recipes.length) newIndex = 0;
      return newIndex;
    });
    resetTimer();
  };

  const slideVariants = {
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
      zIndex: 10,
      width: "min(600px, 85vw)", // Slightly reduced width for better mobile margins
      height: "min(400px, 60vw)",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    left: {
      x: 0,
      scale: 0.6,
      opacity: 0.5,
      zIndex: 0,
      width: "min(192px, 30vw)", // Responsive width
      height: "min(192px, 30vw)", // Responsive height
      left: "1rem",
      transform: "translateY(-50%)",
    },
    right: {
      x: 0,
      scale: 0.6,
      opacity: 0.5,
      zIndex: 0,
      width: "min(192px, 30vw)", // Responsive width
      height: "min(192px, 30vw)", // Responsive height
      left: "calc(100% - min(208px, 32vw))", // Adjusted for responsive width
      transform: "translateY(-50%)",
    },
  };

  return (
    <div className="relative h-[min(500px,70vh)] w-full overflow-hidden px-4">
      <AnimatePresence initial={false} custom={direction}>
        {/* Main Slide */}
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={direction > 0 ? "right" : "left"}
          animate="center"
          exit={direction > 0 ? "left" : "right"}
          variants={slideVariants}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute top-1/2 rounded-2xl overflow-hidden shadow-lg" // Increased border radius
        >
          <Link
            href={`/recipe/${currentRecipe.idMeal}`}
            className="relative w-full h-full block group"
          >
            <Image
              src={currentRecipe.strMealThumb}
              alt={currentRecipe.strMeal}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 85vw, 600px"
            />
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent 
                         backdrop-blur-[2px] text-white 
                         px-4 py-3 sm:px-6 sm:py-4" // Enhanced text container
            >
              <h2 className="text-base sm:text-2xl font-bold line-clamp-1 mb-0.5">
                {currentRecipe.strMeal}
              </h2>
              <p className="text-xs sm:text-sm line-clamp-1 text-gray-200">
                {currentRecipe.strCategory}
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Preview Slides */}
        <motion.div
          key={`prev-${currentIndex}`}
          initial={direction > 0 ? "center" : "right"}
          animate="left"
          exit={direction > 0 ? "right" : "center"}
          variants={slideVariants}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="absolute top-1/2 rounded-xl overflow-hidden hidden sm:block"
        >
          <Image
            src={prevRecipe.strMealThumb}
            alt={prevRecipe.strMeal}
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div
          key={`next-${currentIndex}`}
          initial={direction > 0 ? "left" : "center"}
          animate="right"
          exit={direction > 0 ? "center" : "left"}
          variants={slideVariants}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="absolute top-1/2 rounded-xl overflow-hidden hidden sm:block"
        >
          <Image
            src={nextRecipe.strMealThumb}
            alt={nextRecipe.strMeal}
            fill
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 z-20 
                   bg-white/80 p-2 rounded-full hover:bg-white transition-colors
                   shadow-md hover:shadow-lg"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </button>
      <button
        className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 z-20 
                   bg-white/80 p-2 rounded-full hover:bg-white transition-colors
                   shadow-md hover:shadow-lg"
        onClick={() => paginate(1)}
      >
        <ChevronRight size={20} className="sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}

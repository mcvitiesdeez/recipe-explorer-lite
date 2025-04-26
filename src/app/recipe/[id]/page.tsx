"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactConfetti from "react-confetti";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getIngredientsWithMeasures } from "@/utils/helpers";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorDisplay from "@/components/ErrorDisplay";
import FeedbackForm from "@/components/FeedbackForm";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

async function getMealById(id: string) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch recipe");
  }
  const data = await response.json();
  return data.meals[0];
}

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set()
  );
  const [checkedInstructions, setCheckedInstructions] = useState<Set<number>>(
    new Set()
  );
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(true);
  const progressBarRef = useRef(null);
  const [showIngredientsConfetti, setShowIngredientsConfetti] = useState(false);
  const [showCookingConfetti, setShowCookingConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const [isIngredientsConfettiActive, setIsIngredientsConfettiActive] =
    useState(false);
  const [isCookingConfettiActive, setIsCookingConfettiActive] = useState(false);

  const {
    data: recipe,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getMealById(id as string),
  });

  // Initialize window size
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Progress bar observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsProgressBarVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (progressBarRef.current) {
      observer.observe(progressBarRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Calculate progress percentages
  const ingredientsProgress = recipe
    ? (checkedIngredients.size / getIngredientsWithMeasures(recipe).length) *
      100
    : 0;

  const cookingProgress = recipe
    ? (checkedInstructions.size /
        recipe.strInstructions
          .split(/\r\n|\n|\r/)
          .filter((step: string) => step.trim() !== "").length) *
      100
    : 0;

  // Watch for progress completion
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (ingredientsProgress === 100 && !showIngredientsConfetti) {
      setShowIngredientsConfetti(true);
      setIsIngredientsConfettiActive(true);

      timer = setTimeout(() => {
        setShowIngredientsConfetti(false);
        setIsIngredientsConfettiActive(false);
      }, 10000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [ingredientsProgress]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (cookingProgress === 100 && !showCookingConfetti) {
      setShowCookingConfetti(true);
      setIsCookingConfettiActive(true);

      timer = setTimeout(() => {
        setShowCookingConfetti(false);
        setIsCookingConfettiActive(false);
      }, 10000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [cookingProgress]);

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const newChecked = new Set(prev);
      if (newChecked.has(index)) {
        newChecked.delete(index);
      } else {
        newChecked.add(index);
      }
      return newChecked;
    });
  };

  const toggleInstruction = (index: number) => {
    setCheckedInstructions((prev) => {
      const newChecked = new Set(prev);
      if (newChecked.has(index)) {
        newChecked.delete(index);
      } else {
        newChecked.add(index);
      }
      return newChecked;
    });
  };

  // Progress bar animation variants
  const progressVariants = {
    initial: (progress: number) => ({
      width: `${progress}%`,
      transition: { duration: 0.5, ease: "easeOut" },
    }),
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorDisplay message={(error as Error).message} />;

  const ingredients = getIngredientsWithMeasures(recipe);
  const instructions = recipe.strInstructions
    .split(/\r\n|\n|\r/)
    .filter((step: string) => step.trim() !== "");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Confetti overlays */}
      {showIngredientsConfetti && isIngredientsConfettiActive && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          colors={[
            "#2563EB", // Bright blue
            "#EC4899", // Pink
            "#F59E0B", // Amber
            "#10B981", // Emerald
            "#6366F1", // Indigo
            "#ffffff", // White for contrast
          ]}
          numberOfPieces={200}
          recycle={false} // Set to false to prevent infinite loop
          onConfettiComplete={() => {
            setIsIngredientsConfettiActive(false);
          }}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 100 }}
        />
      )}
      {showCookingConfetti && isCookingConfettiActive && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          colors={[
            "#DC2626", // Red
            "#16A34A", // Green
            "#7C3AED", // Purple
            "#FBBF24", // Yellow
            "#DB2777", // Pink
            "#ffffff", // White for contrast
          ]}
          numberOfPieces={200}
          recycle={false} // Set to false to prevent infinite loop
          onConfettiComplete={() => {
            setIsCookingConfettiActive(false);
          }}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 100 }}
        />
      )}

      {/* Floating Progress Bar */}
      <AnimatePresence>
        {!isProgressBarVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Floating Ingredients Progress */}
                <div className="flex flex-col gap-2">
                  <span className="text-base font-semibold whitespace-nowrap">
                    Ingredients Progress
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-5 relative">
                      <motion.div
                        className="bg-blue-500 h-full rounded-full relative"
                        initial={{ width: "0%" }}
                        animate={{ width: `${ingredientsProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        {ingredientsProgress > 0 && (
                          <motion.div
                            className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-2xl"
                            animate={{ rotate: [0, 360] }}
                            transition={{
                              duration: 0.5,
                              ease: "easeOut",
                              times: [0, 1],
                            }}
                            key={ingredientsProgress}
                          >
                            🍗
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 min-w-[4rem] text-right">
                      {checkedIngredients.size}/{ingredients.length}
                    </span>
                  </div>
                </div>

                {/* Floating Cooking Progress */}
                <div className="flex flex-col gap-2">
                  <span className="text-base font-semibold whitespace-nowrap">
                    Cooking Progress
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-5 relative">
                      <motion.div
                        className="bg-green-500 h-full rounded-full relative"
                        initial={{ width: "0%" }}
                        animate={{ width: `${cookingProgress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        {cookingProgress > 0 && (
                          <motion.div
                            className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-2xl"
                            animate={{ rotate: [0, 360] }}
                            transition={{
                              duration: 0.5,
                              ease: "easeOut",
                              times: [0, 1],
                            }}
                            key={cookingProgress}
                          >
                            🍜
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 min-w-[4rem] text-right">
                      {checkedInstructions.size}/{instructions.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          {recipe.strMeal}
        </h1>

        {/* Image and Info Container */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image Container */}
          <div className="relative w-full lg:w-1/2 aspect-video sm:aspect-square rounded-xl overflow-hidden">
            <Image
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>

          {/* Info Container */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm sm:text-base">
                {recipe.strCategory}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm sm:text-base">
                {recipe.strArea}
              </span>
            </div>

            {/* Progress Indicators - Made Sticky */}
            <div ref={progressBarRef} className="space-y-4 sticky top-4 z-10">
              {/* Ingredients Progress */}
              <div className="bg-gray-100 rounded-lg p-4 shadow-sm backdrop-blur-sm bg-opacity-95">
                <h3 className="text-lg font-semibold mb-2">
                  Ingredients Gathered
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <motion.div
                      className="bg-blue-500 h-full rounded-full relative"
                      initial={{ width: "0%" }}
                      animate={progressVariants.initial(ingredientsProgress)}
                      custom={ingredientsProgress}
                    >
                      {ingredientsProgress > 0 && (
                        <motion.div
                          className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-2xl"
                          style={{ filter: "grayscale(0)" }}
                          animate={{ rotate: [0, 360] }}
                          transition={{
                            duration: 0.5,
                            ease: "easeOut",
                            times: [0, 1],
                          }}
                          key={ingredientsProgress}
                        >
                          🍗
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  <span className="text-sm text-gray-600 min-w-[4rem] text-right">
                    {checkedIngredients.size}/{ingredients.length}
                  </span>
                </div>
              </div>

              {/* Instructions Progress */}
              <div className="bg-gray-100 rounded-lg p-4 shadow-sm backdrop-blur-sm bg-opacity-95">
                <h3 className="text-lg font-semibold mb-2">Cooking Progress</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <motion.div
                      className="bg-green-500 h-full rounded-full relative"
                      initial={{ width: "0%" }}
                      animate={progressVariants.initial(cookingProgress)}
                      custom={cookingProgress}
                    >
                      {cookingProgress > 0 && (
                        <motion.div
                          className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-2xl"
                          style={{ filter: "grayscale(0)" }}
                          animate={{ rotate: [0, 360] }}
                          transition={{
                            duration: 0.5,
                            ease: "easeOut",
                            times: [0, 1],
                          }}
                          key={cookingProgress}
                        >
                          🍜
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  <span className="text-sm text-gray-600 min-w-[4rem] text-right">
                    {checkedInstructions.size}/{instructions.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Ingredients Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Ingredients
          </h2>
          <div className="space-y-2">
            {ingredients.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group transition-colors"
              >
                <button
                  onClick={() => toggleIngredient(index)}
                  className={`w-6 h-6 rounded border ${
                    checkedIngredients.has(index)
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300 group-hover:border-blue-500"
                  } flex items-center justify-center transition-colors`}
                >
                  {checkedIngredients.has(index) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </button>
                <span className="flex-1 text-sm sm:text-base">
                  <span className="font-medium">{index + 1}.</span>{" "}
                  {item.measure} {item.ingredient}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Instructions
          </h2>
          <div className="space-y-4">
            {instructions.map((step: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg group transition-colors"
              >
                <button
                  onClick={() => toggleInstruction(index)}
                  className={`w-6 h-6 mt-1 rounded border cursor-pointer ${
                    checkedInstructions.has(index)
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300 group-hover:border-green-500"
                  } flex items-center justify-center transition-colors`}
                >
                  {checkedInstructions.has(index) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </button>
                <span className="flex-1 text-sm sm:text-base">
                  <span className="font-medium">{index + 1}.</span>{" "}
                  {step.trim()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Section */}
      {recipe.strYoutube && (
        <div className="mt-6 sm:mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Video Tutorial
          </h2>
          <div className="relative pt-[56.25%] rounded-xl overflow-hidden shadow-sm">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${
                recipe.strYoutube.split("v=")[1]
              }`}
              title="Recipe Video Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Feedback Form Section */}
      <div className="mt-8">
        <FeedbackForm mealId={id as string} recipeName={recipe.strMeal} />
      </div>
    </div>
  );
}

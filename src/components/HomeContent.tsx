"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getRandomMeal } from "@/utils/api";
import { Meal } from "@/types";
import RecipeCarousel from "./RecipeCarousel";

export default function HomeContent() {
  const router = useRouter();
  const [randomRecipe, setRandomRecipe] = useState<Meal | null>(null);

  const { refetch } = useQuery({
    queryKey: ["random-recipe"],
    queryFn: async () => {
      const response = await getRandomMeal();
      if (response.meals && response.meals.length > 0) {
        setRandomRecipe(response.meals[0]);
      }
      return response;
    },
    enabled: false,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Recipe Explorer
        </h1>
        <p className="text-lg text-gray-600">
          Discover delicious recipes from around the world
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <RecipeCarousel />
      </motion.div>

      {/* Random Recipe Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Out of Ideas?
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Random Button - Fixed width container */}
          <div className="flex flex-col items-center w-[300px]">
            <button
              onClick={() => refetch()}
              className="transform hover:scale-105 transition-transform duration-300 focus:outline-none cursor-pointer"
            >
              <Image
                src="/images/randomRecipe.png"
                alt="Get Random Recipe"
                width={300}
                height={200}
                className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </button>
            <p className="mt-4 text-gray-600 text-lg text-center">
              Let us suggest a random recipe for you!
            </p>
          </div>

          {/* Recipe Preview - Fixed width container */}
          <div className="w-[300px] h-[400px]">
            <AnimatePresence mode="wait">
              {randomRecipe ? (
                <motion.div
                  key={randomRecipe.idMeal}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col"
                >
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={randomRecipe.strMealThumb}
                      alt={randomRecipe.strMeal}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {randomRecipe.strMeal}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        {randomRecipe.strCategory}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {randomRecipe.strArea}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <button
                        onClick={() =>
                          router.push(`/recipe/${randomRecipe.idMeal}`)
                        }
                        className="w-full bg-[#e63946] text-white py-2 px-4 rounded-lg 
                                 hover:bg-[#e63946]/90 transition-colors duration-300
                                 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        View Recipe
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl shadow-lg p-4 h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-300"
                >
                  <div className="space-y-4">
                    <div className="text-6xl animate-bounce">🎲</div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Feeling Adventurous?
                    </h3>
                    <p className="text-gray-600">
                      Click the image to discover a surprise recipe that might
                      become your next favorite dish!
                    </p>
                    <div className="text-sm text-gray-500 mt-4">
                      <span className="animate-pulse">✨</span> Magic happens
                      with just one click{" "}
                      <span className="animate-pulse">✨</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
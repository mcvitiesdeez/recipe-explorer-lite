"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorDisplay from "@/components/ErrorDisplay";
import {
  getCategories,
  getMealsByCategory,
  searchMealsByName,
  getMealsByLetter,
} from "@/utils/api";
import { Category, Meal } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Create a separate component for the search functionality
function RecipeContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const letterParam = searchParams.get("letter");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || "All"
  );
  const [selectedLetter, setSelectedLetter] = useState<string>(
    letterParam || "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const recipesPerPage = 12;

  // Alphabet array for filter
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Categories Query
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Meals Query
  const {
    data: mealsData,
    isLoading: isLoadingMeals,
    isError: isErrorMeals,
    refetch: refetchMeals,
  } = useQuery({
    queryKey: ["meals", selectedCategory, selectedLetter, debouncedSearchTerm],
    queryFn: async () => {
      if (debouncedSearchTerm) {
        return searchMealsByName(debouncedSearchTerm);
      }

      if (selectedLetter !== "all") {
        return getMealsByLetter(selectedLetter);
      }

      if (selectedCategory === "All") {
        // Fetch all meals by iterating through the alphabet
        const allMeals: Meal[] = [];
        const letters = alphabet;

        // Fetch letters in batches to avoid overwhelming the API
        const batchSize = 4;
        for (let i = 0; i < letters.length; i += batchSize) {
          const batch = letters.slice(i, i + batchSize);
          const batchPromises = batch.map((letter) => getMealsByLetter(letter));
          const batchResults = await Promise.all(batchPromises);

          batchResults.forEach((result) => {
            if (result.meals) {
              allMeals.push(...result.meals);
            }
          });
        }

        // Remove duplicates based on idMeal
        const uniqueMeals = Array.from(
          new Map(allMeals.map((meal) => [meal.idMeal, meal])).values()
        );

        // Sort meals alphabetically by name
        const sortedMeals = uniqueMeals.sort((a, b) =>
          a.strMeal.localeCompare(b.strMeal)
        );

        return { meals: sortedMeals };
      }
      return getMealsByCategory(selectedCategory);
    },
    enabled: !!selectedCategory || !!debouncedSearchTerm || !!selectedLetter,
  });

  // Search Debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // URL Sync
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    }
  }, [categoryParam]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Add this state to track the transition
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  // Add this function to handle page changes with smooth transition
  const handlePageChange = (newPage: number) => {
    setIsPageTransitioning(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsPageTransitioning(false);
    }, 200); // Match this with the animation duration
  };

  // Pagination Logic
  const meals = mealsData?.meals || [];
  const totalPages = Math.ceil(meals.length / recipesPerPage);
  const paginatedMeals = meals.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

  if (isLoadingCategories) return <LoadingSpinner />;
  if (isErrorCategories)
    return <ErrorDisplay message="Failed to load categories" />;

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Section */}
      <motion.div className="text-center mb-12" variants={itemVariants}>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Delicious Recipes
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our collection of mouth-watering recipes from around the world
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      {/* Alphabet Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => {
              setSelectedLetter("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              selectedLetter === "all"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => {
                setSelectedLetter(letter);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-md cursor-pointer ${
                selectedLetter === letter
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Filter */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-full cursor-pointer ${
                  selectedCategory === "All"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categoriesData?.categories.map((category: Category) => (
                <button
                  key={category.strCategory}
                  onClick={() => setSelectedCategory(category.strCategory)}
                  className={`px-4 py-2 rounded-full cursor-pointer ${
                    selectedCategory === category.strCategory
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {category.strCategory}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipes Grid with AnimatePresence */}
      {isLoadingMeals ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : isErrorMeals ? (
        <ErrorDisplay message="Failed to load recipes" retry={refetchMeals} />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage} // This forces a re-render with animation when page changes
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            style={{ minHeight: "600px" }} // Add minimum height to prevent layout shift
          >
            {paginatedMeals.map((meal: Meal) => (
              <motion.div
                key={meal.idMeal}
                variants={itemVariants}
                layout // This helps maintain smooth transitions
                className="relative" // Required for proper layout animations
              >
                <RecipeCard recipe={meal} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination with smooth transitions */}
      {totalPages > 1 && (
        <motion.div
          className="mt-8 flex justify-center gap-2"
          layout // This helps maintain smooth transitions
        >
          {/* First Page Button */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || isPageTransitioning}
            className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100 transition-colors"
            aria-label="First page"
          >
            <ChevronsLeft size={20} className="mr-1" />
          </button>

          {/* Previous Page Button */}
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || isPageTransitioning}
            className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {(() => {
              const pages = [];
              const maxVisible = 5;
              let start = Math.max(
                1,
                Math.min(
                  currentPage - Math.floor(maxVisible / 2),
                  totalPages - maxVisible + 1
                )
              );
              const end = Math.min(start + maxVisible - 1, totalPages);

              if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
              }

              for (let i = start; i <= end; i++) {
                pages.push(
                  <motion.button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    disabled={isPageTransitioning}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === i
                        ? "bg-orange-500 text-white"
                        : "border hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {i}
                  </motion.button>
                );
              }
              return pages;
            })()}
          </div>

          {/* Next Page Button */}
          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages || isPageTransitioning}
            className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>

          {/* Last Page Button */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || isPageTransitioning}
            className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100 transition-colors"
            aria-label="Last page"
          >
            <ChevronsRight size={20} className="mr-1" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Main page component
export default function RecipePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RecipeContent />
    </Suspense>
  );
}

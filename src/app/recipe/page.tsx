"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorDisplay from "@/components/ErrorDisplay";
import {
  getCategories,
  getMealsByCategory,
  searchMealsByName,
} from "@/utils/api";
import { Category, Meal } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

export default function RecipePage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || "All"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const recipesPerPage = 12;

  // Categories Query
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Meals Query
  const {
    data: mealsData,
    isLoading: isLoadingMeals,
    isError: isErrorMeals,
    error: mealsError,
    refetch: refetchMeals,
  } = useQuery({
    queryKey: ["meals", selectedCategory, debouncedSearchTerm],
    queryFn: async () => {
      if (debouncedSearchTerm) {
        return searchMealsByName(debouncedSearchTerm);
      }
      if (selectedCategory === "All") {
        // Get random meals or featured meals
        return getMealsByCategory("Beef"); // Default category
      }
      return getMealsByCategory(selectedCategory);
    },
    enabled: !!selectedCategory || !!debouncedSearchTerm,
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
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Filter size={20} />
          <span>Filter</span>
        </button>
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

      {/* Recipes Grid */}
      {isLoadingMeals ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : isErrorMeals ? (
        <ErrorDisplay message="Failed to load recipes" retry={refetchMeals} />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {paginatedMeals.map((meal: Meal) => (
            <motion.div key={meal.idMeal} variants={itemVariants}>
              <RecipeCard recipe={meal} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg ${
                currentPage === page
                  ? "bg-orange-500 text-white"
                  : "border hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

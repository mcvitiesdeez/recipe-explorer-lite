"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Image from "next/image";
import { Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { FeedbackItem, MealDetails } from "@/types";

const ITEMS_PER_PAGE = 10;

export default function FeedbackPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Query to fetch all feedback
  const {
    data: feedbackItems,
    isLoading: isFeedbackLoading,
    error: feedbackError,
  } = useQuery({
    queryKey: ["all-feedback"],
    queryFn: async () => {
      const feedbackRef = collection(db, "feedback");
      const snapshot = await getDocs(feedbackRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FeedbackItem[];
    },
  });

  // Query to fetch meal details for each feedback item
  const { data: mealDetails, isLoading: isMealsLoading } = useQuery({
    queryKey: ["meal-details", feedbackItems],
    queryFn: async () => {
      if (!feedbackItems) return {};

      const mealDetailsMap: Record<string, MealDetails> = {};

      for (const feedback of feedbackItems) {
        if (!mealDetailsMap[feedback.mealId]) {
          const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${feedback.mealId}`
          );
          const data = await response.json();
          if (data.meals?.[0]) {
            mealDetailsMap[feedback.mealId] = data.meals[0];
          }
        }
      }

      return mealDetailsMap;
    },
    enabled: !!feedbackItems,
  });

  if (isFeedbackLoading || isMealsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (feedbackError) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading feedback. Please try again later.
      </div>
    );
  }

  // Pagination calculations
  const totalItems = feedbackItems?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFeedbackItems = feedbackItems?.slice(startIndex, endIndex) || [];

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Community Feedback</h1>

      {/* Feedback Count */}
      <p className="text-gray-600 mb-4">
        Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
        {totalItems} reviews
      </p>

      {/* Feedback Items */}
      <div className="space-y-6">
        {currentFeedbackItems.map((feedback) => {
          const meal = mealDetails?.[feedback.mealId];
          return (
            <div
              key={feedback.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6"
            >
              {/* Meal Image and Title */}
              <div className="md:w-1/4">
                <Link href={`/recipe/${feedback.mealId}`}>
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                    {meal && (
                      <Image
                        src={meal.strMealThumb}
                        alt={feedback.recipeName}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <h3 className="mt-2 font-semibold text-lg hover:text-orange-500 transition-colors">
                    {feedback.recipeName}
                  </h3>
                </Link>
              </div>

              {/* Feedback Content */}
              <div className="md:w-3/4">
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <span className="font-semibold">{feedback.name}</span>
                  <span className="text-gray-500">{feedback.email}</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 ${
                          index < feedback.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{feedback.comment}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(feedback.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          {/* Previous Page Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === page
                    ? "bg-orange-500 text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Page Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100"
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

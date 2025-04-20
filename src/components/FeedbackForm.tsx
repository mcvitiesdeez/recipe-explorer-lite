"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { FeedbackFormData } from "@/types";
import { MessageCircle, Loader2, Star } from "lucide-react";
import { motion } from "framer-motion";

interface FeedbackFormProps {
  mealId: string;
  recipeName: string;
}

export default function FeedbackForm({
  mealId,
  recipeName,
}: FeedbackFormProps) {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    email: "",
    comment: "",
    rating: 5,
    mealId: mealId,
  });

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

  const feedbackMutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      const feedbackRef = collection(db, "feedback");
      const docRef = await addDoc(feedbackRef, {
        ...data,
        timestamp: new Date().toISOString(),
        recipeName: recipeName,
      });
      return docRef.id;
    },
    onSuccess: () => {
      setFormData({
        name: "",
        email: "",
        comment: "",
        rating: 5,
        mealId: mealId,
      });
      alert("Thank you for your feedback!");
    },
    onError: (error) => {
      alert("Error submitting feedback. Please try again.");
      console.error("Feedback submission error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    feedbackMutation.mutate(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white rounded-xl shadow-lg p-6 mt-8"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 mb-6"
      >
        <MessageCircle className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-semibold">Rate this Recipe</h2>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div variants={itemVariants}>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter your name"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, rating: star }))
                }
                className="focus:outline-none cursor-pointer"
              >
                <Star
                  className={`w-8 h-8 transition-colors duration-200 ${
                    star <= formData.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  } hover:text-yellow-400 hover:fill-yellow-400`}
                />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Review
          </label>
          <textarea
            id="comment"
            name="comment"
            required
            value={formData.comment}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Share your experience with this recipe..."
          />
        </motion.div>

        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={feedbackMutation.isPending}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 
                   transition-colors duration-300 flex items-center justify-center gap-2"
        >
          {feedbackMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

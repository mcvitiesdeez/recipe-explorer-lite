"use client";

import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRandomMeals } from "@/utils/api";
import LoadingSpinner from "./LoadingSpinner";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RecipeCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["carousel-recipes"],
    queryFn: () => getRandomMeals(10),
  });

  if (isLoading || !recipes) return <LoadingSpinner />;

  return (
    <div className="relative">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {recipes.map((recipe) => (
            <Link
              href={`/recipe/${recipe.idMeal}`}
              key={recipe.idMeal}
              className="embla__slide flex-[0_0_100%] min-w-0 relative group cursor-pointer md:flex-[0_0_50%] lg:flex-[0_0_33.33%]"
            >
              <div className="relative aspect-video m-4 overflow-hidden rounded-xl">
                <Image
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg line-clamp-2 pl-12 pr-12">
                    {recipe.strMeal}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100
                   h-[calc(100%-2rem)] px-4 rounded-l-xl shadow-lg transition-all duration-300 z-10
                   flex items-center justify-center group"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-125 transition-transform duration-300" />
      </button>
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100
                   h-[calc(100%-2rem)] px-4 rounded-r-xl shadow-lg transition-all duration-300 z-10
                   flex items-center justify-center group"
        onClick={scrollNext}
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-125 transition-transform duration-300" />
      </button>
    </div>
  );
}

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Meal } from "@/types";
interface RecipeCardProps {
  recipe: Meal;
}
export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      href={`/recipe/${recipe.idMeal}`}
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      {" "}
      <div className="relative h-48 w-full">
        <Image
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          fill
          className="rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />{" "}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-[#e63946] transition-colors">
          {" "}
          {recipe.strMeal}
        </h3>
      </div>
    </Link>
  );
}

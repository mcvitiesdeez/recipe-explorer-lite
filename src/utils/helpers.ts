import { Meal } from "@/types";

// Function to extract ingredients and measurements from a meal
export const getIngredientsWithMeasures = (
  meal: Meal
): { ingredient: string; measure: string }[] => {
  const ingredients: { ingredient: string; measure: string }[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal];
    const measure = meal[`strMeasure${i}` as keyof Meal];

    if (
      ingredient &&
      ingredient.trim() !== "" &&
      measure &&
      measure.trim() !== ""
    ) {
      ingredients.push({
        ingredient: ingredient as string,
        measure: measure as string,
      });
    }
  }

  return ingredients;
};

// Function to truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// Function to extract YouTube video ID
export const getYoutubeVideoId = (url: string | null): string | null => {
  if (!url) return null;

  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[7].length === 11 ? match[7] : null;
};

// Function to format date
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

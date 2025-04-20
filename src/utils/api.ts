import {
  MealResponse,
  CategoryResponse,
  AreaResponse,
  IngredientResponse,
} from "@/types";

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Get a random meal
export const getRandomMeal = async (): Promise<MealResponse> => {
  const response = await fetch(`${API_BASE_URL}/random.php`);
  if (!response.ok) {
    throw new Error("Failed to fetch random meal");
  }
  return response.json();
};

// Get a meal by ID
export const getMealById = async (id: string): Promise<MealResponse> => {
  const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch meal with id ${id}`);
  }
  return response.json();
};

// Search meals by name
export const searchMealsByName = async (
  name: string
): Promise<MealResponse> => {
  const response = await fetch(`${API_BASE_URL}/search.php?s=${name}`);
  if (!response.ok) {
    throw new Error(`Failed to search meals with name ${name}`);
  }
  return response.json();
};

// Get all categories
export const getCategories = async (): Promise<CategoryResponse> => {
  const response = await fetch(`${API_BASE_URL}/categories.php`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

// Get meals by category
export const getMealsByCategory = async (
  category: string
): Promise<MealResponse> => {
  const response = await fetch(`${API_BASE_URL}/filter.php?c=${category}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch meals for category ${category}`);
  }
  return response.json();
};

// Get meals by area
export const getMealsByArea = async (area: string): Promise<MealResponse> => {
  const response = await fetch(`${API_BASE_URL}/filter.php?a=${area}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch meals for area ${area}`);
  }
  return response.json();
};

// Get meals by main ingredient
export const getMealsByIngredient = async (
  ingredient: string
): Promise<MealResponse> => {
  const response = await fetch(`${API_BASE_URL}/filter.php?i=${ingredient}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch meals with ingredient ${ingredient}`);
  }
  return response.json();
};

// Get all areas
export const getAreas = async (): Promise<AreaResponse> => {
  const response = await fetch(`${API_BASE_URL}/list.php?a=list`);
  if (!response.ok) {
    throw new Error("Failed to fetch areas");
  }
  return response.json();
};

// Get all ingredients
export const getIngredients = async (): Promise<IngredientResponse> => {
  const response = await fetch(`${API_BASE_URL}/list.php?i=list`);
  if (!response.ok) {
    throw new Error("Failed to fetch ingredients");
  }
  return response.json();
};

// Get multiple random meals for the carousel (10 meals)
export const getRandomMeals = async (
  count: number = 10
): Promise<MealResponse["meals"]> => {
  const meals = [];
  for (let i = 0; i < count; i++) {
    const response = await getRandomMeal();
    if (response.meals && response.meals.length > 0) {
      meals.push(response.meals[0]);
    }
  }
  return meals;
};

// Filter vegetarian meals
export const getVegetarianMeals = async (): Promise<MealResponse> => {
  const response = await getMealsByCategory("Vegetarian");
  return response;
};

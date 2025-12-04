import SAMPLE_DISHES from "../data/sampleDishes";

const USER_RECIPES_KEY = "dishcovery:recipes";

// Load user-created recipes from localStorage
export function loadUserRecipes() {
  try {
    return JSON.parse(localStorage.getItem(USER_RECIPES_KEY) || "[]");
  } catch {
    return [];
  }
}

// Persist user-created recipes to localStorage
export function saveUserRecipes(recipes) {
  localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(recipes));
}

// Return all recipes (sample from JSON + user-created from storage)
export function getAllRecipes() {
  const userRecipes = loadUserRecipes();
  return {
    sample: SAMPLE_DISHES,
    user: userRecipes,
    all: [...SAMPLE_DISHES, ...userRecipes],
  };
}



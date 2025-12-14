import recipes from "./recipes.json";

// Expose sample recipes from the JSON "database" so the rest of the app
// can continue importing `SAMPLE_DISHES` as before.
const SAMPLE_DISHES = recipes.sampleRecipes;

export default SAMPLE_DISHES;

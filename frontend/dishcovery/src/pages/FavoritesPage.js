import React, { useEffect, useState } from "react";
import "../App.css";
import NavBar from "../components/NavBar";
import RecipeGrid from "../components/RecipeGrid";
import RecipeDetailModal from "../components/RecipeDetailModal";
import { getUserFavorites, addFavorite, deleteFavorite, getRecipes } from "../api/backend";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load favorites and recipes from backend
  useEffect(() => {
    async function loadData() {
      try {
        const userStr = sessionStorage.getItem("dishcovery:user");
        if (!userStr) {
          setLoading(false);
          return;
        }
        
        const user = JSON.parse(userStr);
        const userId = user?.id;
        
        if (!userId) {
          setLoading(false);
          return;
        }

        // Fetch all recipes and user's favorites in parallel
        const [recipesData, favoritesData] = await Promise.all([
          getRecipes(),
          getUserFavorites(userId)
        ]);

        // Transform recipes to match the expected format
        const transformedRecipes = recipesData.map(r => ({
          id: r.recipeId,
          backendId: r.recipeId,
          name: r.title,
          image: r.description || "",
          ingredients: r.ingredients ? JSON.parse(r.ingredients) : [],
          instructions: r.steps || "",
          category: "Recipe",
          cuisine: "Other",
          userId: r.userId,
          cookTimeMinutes: 45,
          difficulty: "Medium",
          isUserMade: true
        }));

        setDishes(transformedRecipes);
        
        // Extract recipe IDs from favorites
        const favoriteRecipeIds = favoritesData.map(fav => fav.recipeId);
        setFavorites(favoriteRecipeIds);
        setLoading(false);
      } catch (err) {
        console.error("Error loading favorites:", err);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter only favorite recipes
  const favoriteDishes = dishes.filter((d) => favorites.includes(d.id));

  // Toggle favorite
  async function toggleFav(recipeId) {
    try {
      const userStr = sessionStorage.getItem("dishcovery:user");
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      const userId = user?.id;
      
      if (!userId) return;

      const isFavorite = favorites.includes(recipeId);
      
      if (isFavorite) {
        // Remove from favorites
        const favoritesData = await getUserFavorites(userId);
        const favoriteToDelete = favoritesData.find(fav => fav.recipeId === recipeId);
        
        if (favoriteToDelete) {
          await deleteFavorite(favoriteToDelete.favoriteId);
          setFavorites(favorites.filter(id => id !== recipeId));
        }
      } else {
        // Add to favorites
        await addFavorite({ userId, recipeId });
        setFavorites([...favorites, recipeId]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  }

  if (loading) {
    return (
      <div className="App">
        <NavBar />
        <main className="container">
          <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <NavBar />
      <main className="container">
        <h2 className="section-title">⭐ Your Favorite Recipes</h2>
        {favoriteDishes.length > 0 ? (
          <RecipeGrid
            dishes={favoriteDishes}
            onOpen={setSelected}
            favorites={favorites}
            toggleFav={toggleFav}
          />
        ) : (
          <p style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>
            You don’t have any favorite recipes yet. ⭐<br />
            Go back to the Home Page and add some!
          </p>
        )}
      </main>

      <RecipeDetailModal
        dish={selected}
        onClose={() => setSelected(null)}
        isFav={(id) => favorites.includes(id)}
        toggleFav={toggleFav}
      />
    </div>
  );
}

export default FavoritesPage;

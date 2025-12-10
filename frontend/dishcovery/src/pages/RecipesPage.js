import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import RecipeGrid from "../components/RecipeGrid";
import RecipeDetailModal from "../components/RecipeDetailModal";
import { getRecipes, getUserFavorites, addFavorite, deleteFavorite } from "../api/backend";

function RecipesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);

  // Load recipes from backend only
  useEffect(() => {
    getRecipes()
      .then((data) => {
        // map backend RecipeEntity to frontend shape
        const mapped = (data || []).map((r) => ({
          id: r.recipeId,
          backendId: r.recipeId,
          name: r.title,
          image: r.image,
          description: r.description,
          cuisine: r.category || "",
          ingredients: (typeof r.ingredients === "string" && r.ingredients) ? JSON.parse(r.ingredients) : (r.ingredients || []),
          instructions: r.steps,
          cookTimeMinutes: r.cookTimeMinutes || null,
          difficulty: r.difficulty || null,
          rating: 0,
          estimatedPrice: r.estimatedPrice || null,
          isUserMade: true,
        }));
        setUserRecipes(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch recipes:", err);
        alert("Failed to load recipes. Please check the server connection.");
      });
    
    // Fetch user favorites
    const fetchFavorites = async () => {
      try {
        const userStr = sessionStorage.getItem("dishcovery:user");
        if (userStr) {
          const user = JSON.parse(userStr);
          const userId = user?.id;
          if (userId) {
            const favoritesData = await getUserFavorites(userId);
            const favoriteRecipeIds = favoritesData.map(fav => fav.recipeId);
            setFavorites(favoriteRecipeIds);
          }
        }
      } catch (err) {
        console.warn("Could not fetch favorites", err);
      }
    };
    
    fetchFavorites();
  }, []);

  // Extract ?filter=<CuisineName>
  const params = new URLSearchParams(location.search);
  const category = params.get("filter") || "All";

  // Use backend recipes only
  const allDishes = useMemo(() => {
    return userRecipes;
  }, [userRecipes]);

  // Filter recipes
  const dishes = useMemo(() => {
    if (category === "All") return allDishes;
    return allDishes.filter((d) => d.cuisine === category);
  }, [category, allDishes]);

  // Toggle favorite
  async function toggleFav(recipeId) {
    try {
      const userStr = sessionStorage.getItem("dishcovery:user");
      if (!userStr) {
        alert("Please log in to add favorites");
        return;
      }
      
      const user = JSON.parse(userStr);
      const userId = user?.id;
      
      if (!userId) {
        alert("Please log in to add favorites");
        return;
      }

      const isFavorite = favorites.includes(recipeId);
      
      if (isFavorite) {
        // Remove from favorites
        const favoritesData = await getUserFavorites(userId);
        const favoriteToDelete = favoritesData.find(fav => fav.recipeId === recipeId);
        
        if (favoriteToDelete) {
          await deleteFavorite(favoriteToDelete.favoriteId);
          setFavorites(prev => prev.filter(id => id !== recipeId));
        }
      } else {
        // Add to favorites
        await addFavorite({ userId, recipeId });
        setFavorites(prev => [...prev, recipeId]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert("Failed to update favorite. Please try again.");
    }
  }

  return (
    <div className="App" style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <NavBar />
      <main className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 className="section-title">
            {category === "All" ? "All Recipes" : `${category} Recipes`}
          </h2>

          {/* Clear Filter - go back to Categories so user can pick again */}
          {category !== "All" && (
            <button
              onClick={() => navigate("/categories")}
              style={{
                background: "#36489e",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              × Clear Filter
            </button>
          )}
        </div>

        {dishes.length > 0 ? (
          <RecipeGrid
            dishes={dishes}
            onOpen={setSelected}
            favorites={favorites}
            toggleFav={toggleFav}
          />
        ) : (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No recipes found for <strong>{category}</strong>.
          </p>
        )}
      </main>

      {selected && (
        <RecipeDetailModal
          dish={selected}
          onClose={() => setSelected(null)}
          isFav={(id) => favorites.includes(id)}
          toggleFav={toggleFav}
        />
      )}
    </div>
  );
}

export default RecipesPage;

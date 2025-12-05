import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import RecipeGrid from "../components/RecipeGrid";
import RecipeDetailModal from "../components/RecipeDetailModal";
import { getRecipes } from "../api/backend";

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
          image: r.description,
          cuisine: r.category || "",
          ingredients: (typeof r.ingredients === "string" && r.ingredients) ? JSON.parse(r.ingredients) : (r.ingredients || []),
          instructions: r.steps,
          isUserMade: true,
        }));
        setUserRecipes(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch recipes:", err);
        alert("Failed to load recipes. Please check the server connection.");
      });
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
  function toggleFav(id) {
    setFavorites((prev) => {
      return prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
    });
  }

  return (
    <div className="App">
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
              ✕ Clear Filter
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

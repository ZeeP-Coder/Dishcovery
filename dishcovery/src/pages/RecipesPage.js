import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import RecipeGrid from "../components/RecipeGrid";
import RecipeDetailModal from "../components/RecipeDetailModal";
import SAMPLE_DISHES from "../data/sampleDishes";

function RecipesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("dishcovery:favs") || "[]");
    } catch {
      return [];
    }
  });

  const [userRecipes, setUserRecipes] = useState([]);

  // Load user-added recipes
  useEffect(() => {
    // fetch recipes from backend and merge
    fetch("http://localhost:8080/recipe/getAllRecipes")
      .then((res) => res.json())
      .then((data) => {
        // map backend RecipeEntity to frontend shape
        const mapped = (data || []).map((r) => ({
          id: r.recipeId,
          name: r.title,
          image: r.description,
          cuisine: r.category || "",
          ingredients: r.ingredients || [],
          instructions: r.steps,
          isUserMade: true,
        }));
        setUserRecipes(mapped);
      })
      .catch(() => {
        const saved = JSON.parse(localStorage.getItem("dishcovery:recipes")) || [];
        setUserRecipes(saved);
      });
  }, []);

  // Extract ?filter=<CuisineName>
  const params = new URLSearchParams(location.search);
  const category = params.get("filter") || "All";

  // Merge sample dishes + user-added dishes
  const allDishes = useMemo(() => {
    const merged = [
      ...SAMPLE_DISHES,
      ...userRecipes.map((r) => ({
        id: r.id,
        name: r.name,
        image: r.image,
        cuisine: r.cuisine,
        ingredients: r.ingredients,
        instructions: r.instructions,
        isUserMade: true, // so you know where it came from (optional)
      })),
    ];
    return merged;
  }, [userRecipes]);

  // Filter recipes
  const dishes = useMemo(() => {
    if (category === "All") return allDishes;
    return allDishes.filter((d) => d.cuisine === category);
  }, [category, allDishes]);

  // Toggle favorite
  function toggleFav(id) {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem("dishcovery:favs", JSON.stringify(updated));
      return updated;
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

          {/* Clear Filter */}
          {category !== "All" && (
            <button
              onClick={() => navigate("/recipes?filter=All")}
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

      <RecipeDetailModal
        dish={selected}
        onClose={() => setSelected(null)}
        isFav={(id) => favorites.includes(id)}
        toggleFav={toggleFav}
      />
    </div>
  );
}

export default RecipesPage;

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

  // Extract ?filter=<CuisineName>
  const params = new URLSearchParams(location.search);
  const category = params.get("filter") || "All";

  // Filter recipes based on selected category
  const dishes = useMemo(() => {
    if (category === "All") return SAMPLE_DISHES;
    return SAMPLE_DISHES.filter((d) => d.cuisine === category);
  }, [category]);

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

          {/* Replace Back with Clear Filter */}
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

// HomePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../App.css";

// Components
import NavBar from "../components/NavBar";
import HeroBanner from "../components/HeroBanner";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import RecipeGrid from "../components/RecipeGrid";
import RecipeDetailModal from "../components/RecipeDetailModal";

import SAMPLE_DISHES from "../data/sampleDishes";

export default function HomePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("All");

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("dishcovery:favs") || "[]");
    } catch {
      return [];
    }
  });

  const [userRecipes, setUserRecipes] = useState([]);

  // Load user recipes
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("dishcovery:recipes")) || [];
    setUserRecipes(saved);
  }, []);

  // Normalize recipe structure
  const normalizeRecipe = (r) => ({
    id: r.id,
    name: r.name || "Untitled",
    image: r.image || "",
    cuisine: r.cuisine || "Other",
    ingredients: Array.isArray(r.ingredients)
      ? r.ingredients.map((i) => (typeof i === "string" ? { name: i } : i))
      : [],
    instructions: r.instructions || "",
    cookTimeMinutes: r.cookTimeMinutes || 45,
    difficulty: r.difficulty || "Medium",
    isUserMade: !!r.user,
    original: r,
  });

  // Combine sample + user recipes
  const allDishes = useMemo(() => {
    const userNorm = userRecipes.map(normalizeRecipe);
    const sampleNorm = SAMPLE_DISHES.map(normalizeRecipe);

    userNorm.sort((a, b) => (b.id || 0) - (a.id || 0));

    return [...sampleNorm, ...userNorm];
  }, [userRecipes]);

  // Extract all cuisines + "All"
  const cuisines = useMemo(() => {
    const set = new Set(allDishes.map((d) => d.cuisine));
    return ["All", ...Array.from(set)];
  }, [allDishes]);

  // Filter dishes by search + cuisine
  const filteredDishes = useMemo(() => {
    const s = search.trim().toLowerCase();

    return allDishes.filter((d) => {
      if (cuisineFilter !== "All" && d.cuisine !== cuisineFilter)
        return false;

      if (!s) return true;

      if (d.name.toLowerCase().includes(s)) return true;
      if (d.cuisine.toLowerCase().includes(s)) return true;
      if (d.instructions.toLowerCase().includes(s)) return true;

      if (
        Array.isArray(d.ingredients) &&
        d.ingredients.some((i) =>
          (i?.name || "").toLowerCase().includes(s)
        )
      )
        return true;

      return false;
    });
  }, [search, cuisineFilter, allDishes]);

  // Favorite toggle
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

      <HeroBanner />

      <main className="container">

        {/* Search Bar (custom component) */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Filter Bar */}
        <FilterBar
          cuisines={cuisines}
          selected={cuisineFilter}
          onSelect={setCuisineFilter}
        />

        {/* Recipes Section */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Recipes</h2>
            
            <button
            className="btn-primary create-recipe-btn"
            onClick={() => navigate("/create-recipe")}
            >
              + Add Recipe
              </button>
              </div>

  <RecipeGrid
    dishes={filteredDishes}
    onOpen={setSelected}
    favorites={favorites}
    toggleFav={toggleFav}
  />
</section>

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

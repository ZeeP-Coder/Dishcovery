import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import NavBar from "../components/NavBar";
import HeroBanner from "../components/HeroBanner";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import RecipeGrid from "../components/RecipeGrid";
import RecipeDetailModal from "../components/RecipeDetailModal";
import { getAllRecipes } from "../utils/recipeStorage";

export default function HomePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("dishcovery:favs") || "[]")
  );

  const normalizeRecipe = (r) => ({
    id: r.id,
    name: r.name || "Untitled",
    image: r.image || "",
    // Prefer explicit cuisine, then category (used by created recipes),
    // so new recipes appear under the correct category (e.g., "Italian").
    cuisine: r.cuisine || r.category || "Other",
    ingredients: Array.isArray(r.ingredients)
      ? r.ingredients.map((i) => (typeof i === "string" ? { name: i } : i))
      : [],
    // Use description if present, otherwise fall back to instructions
    description: r.description || r.instructions || "",
    instructions: r.instructions || "",
    cookTimeMinutes: r.cookTimeMinutes || 45,
    difficulty: r.difficulty || "Medium",
    isUserMade: !!r.user,
    original: r,
  });

  const allDishes = useMemo(() => {
    const { sample, user } = getAllRecipes(); // sample = JSON recipes, user = localStorage recipes
    const userNorm = user.map(normalizeRecipe);
    const sampleNorm = sample.map(normalizeRecipe);
    userNorm.sort((a, b) => (b.id || 0) - (a.id || 0));
    return [...sampleNorm, ...userNorm];
  }, []);

  const cuisines = useMemo(() => {
    const set = new Set(allDishes.map((d) => d.cuisine));
    return ["All", ...Array.from(set)];
  }, [allDishes]);

  const filteredDishes = useMemo(() => {
    const s = search.trim().toLowerCase();
    return allDishes.filter((d) => {
      if (cuisineFilter !== "All" && d.cuisine !== cuisineFilter) return false;
      if (!s) return true;
      if (d.name.toLowerCase().includes(s)) return true;
      if (d.cuisine.toLowerCase().includes(s)) return true;
      if (d.instructions.toLowerCase().includes(s)) return true;
      if (Array.isArray(d.ingredients) && d.ingredients.some((i) => (i?.name || "").toLowerCase().includes(s))) return true;
      return false;
    });
  }, [search, cuisineFilter, allDishes]);

  function toggleFav(id) {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("dishcovery:favs", JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <div className="App">
      <NavBar />
      <HeroBanner />
      <main className="container">
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar cuisines={cuisines} selected={cuisineFilter} onSelect={setCuisineFilter} />
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Recipes</h2>
            <button className="btn-primary create-recipe-btn" onClick={() => navigate("/create-recipe")}>+ Add Recipe</button>
          </div>
          <RecipeGrid dishes={filteredDishes} onOpen={setSelected} favorites={favorites} toggleFav={toggleFav} />
        </section>
      </main>
      <RecipeDetailModal dish={selected} onClose={() => setSelected(null)} isFav={(id) => favorites.includes(id)} toggleFav={toggleFav} />
    </div>
  );
}

// HomePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import RecipeGrid from "../components/RecipeGrid";
import RecipeDetailModal from "../components/RecipeDetailModal";
import SAMPLE_DISHES from "../data/sampleDishes";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("dishcovery:favs") || "[]");
    } catch {
      return [];
    }
  });

  const [userRecipes, setUserRecipes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("dishcovery:recipes")) || [];
    setUserRecipes(saved);
  }, []);

  // normalize helper
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

  const allDishes = useMemo(() => {
    const userNorm = userRecipes.map(normalizeRecipe);
    const sampleNorm = SAMPLE_DISHES.map(normalizeRecipe);
    // Optionally put user recipes first or last — we'll put newest first
    // sort user recipes by id (timestamp)
    userNorm.sort((a, b) => (b.id || 0) - (a.id || 0));
    return [...sampleNorm, ...userNorm];
  }, [userRecipes]);

  const filteredDishes = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return allDishes;
    return allDishes.filter((d) => {
      if (d.name.toLowerCase().includes(s)) return true;
      if (d.cuisine.toLowerCase().includes(s)) return true;
      if (d.instructions && d.instructions.toLowerCase().includes(s)) return true;
      // ingredients
      if (Array.isArray(d.ingredients)) {
        if (d.ingredients.some((i) => (i?.name || "").toLowerCase().includes(s)))
          return true;
      }
      return false;
    });
  }, [search, allDishes]);

  // Toggle favorite
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

      <main className="container">
        <h2 className="section-title">Discover Recipes</h2>

        <input
          type="text"
          placeholder="Search recipes..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <RecipeGrid dishes={filteredDishes} onOpen={setSelected} favorites={favorites} toggleFav={toggleFav} />
      </main>

      <RecipeDetailModal dish={selected} onClose={() => setSelected(null)} isFav={(id) => favorites.includes(id)} toggleFav={toggleFav} />
    </div>
  );
}

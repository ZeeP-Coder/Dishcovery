import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

import NavBar from "./components/NavBar.js";
import HeroBanner from "./components/HeroBanner.js";
import SearchBar from "./components/SearchBar.js";
import FilterBar from "./components/FilterBar.js";
import RecipeGrid from "./components/RecipeGrid.js";
import RecipeDetailModal from "./components/RecipeDetailModal.js";

import SAMPLE_DISHES from "./data/sampleDishes.js";

function App() {
  const [dishes, setDishes] = useState([]);
  const [query, setQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [selected, setSelected] = useState(null); // dish object
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("dishcovery:favs") || "[]");
    } catch {
      return [];
    }
  });

  // load sample data (replace with fetch in production)
  useEffect(() => {
    // simulate fetch
    setTimeout(() => {
      setDishes(SAMPLE_DISHES);
    }, 150);
  }, []);

  // persist favorites
  useEffect(() => {
    localStorage.setItem("dishcovery:favs", JSON.stringify(favorites));
  }, [favorites]);

  const cuisines = useMemo(() => {
    const set = new Set(dishes.map((d) => d.cuisine));
    return ["All", ...Array.from(set)];
  }, [dishes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dishes.filter((d) => {
      if (cuisineFilter !== "All" && d.cuisine !== cuisineFilter) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.ingredients.some((i) => i.name.toLowerCase().includes(q))
      );
    });
  }, [dishes, query, cuisineFilter]);

  function toggleFav(id) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="App">
      <NavBar />
      <HeroBanner />
      <main className="container">
        <div className="controls-row">
          <SearchBar value={query} onChange={setQuery} />
          <div className="right-controls">
            <FilterBar cuisines={cuisines} selected={cuisineFilter} onSelect={setCuisineFilter} />
          </div>
        </div>

        <section className="section">
          <h2 className="section-title">Recipes</h2>
          <RecipeGrid dishes={filtered} onOpen={setSelected} favorites={favorites} toggleFav={toggleFav} />
        </section>
      </main>

      <footer className="footer">© {new Date().getFullYear()} Dishcovery • Built with ❤️</footer>

      <RecipeDetailModal dish={selected} onClose={() => setSelected(null)} isFav={(id) => favorites.includes(id)} toggleFav={toggleFav} />
    </div>
  );
}

export default App;

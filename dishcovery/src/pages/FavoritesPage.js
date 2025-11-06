import React, { useEffect, useState } from "react";
import "../App.css";
import NavBar from "../components/NavBar";
import RecipeGrid from "../components/RecipeGrid";
import RecipeDetailModal from "../components/RecipeDetailModal";
import SAMPLE_DISHES from "../data/sampleDishes";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selected, setSelected] = useState(null);

  // Load data
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem("dishcovery:favs") || "[]");
      setFavorites(favs);
      setDishes(SAMPLE_DISHES);
    } catch {
      setFavorites([]);
    }
  }, []);

  // Filter only favorite recipes
  const favoriteDishes = dishes.filter((d) => favorites.includes(d.id));

  // Toggle favorite (remove if already in)
  function toggleFav(id) {
    const updated = favorites.includes(id)
      ? favorites.filter((x) => x !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("dishcovery:favs", JSON.stringify(updated));
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

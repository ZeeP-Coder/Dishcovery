import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SAMPLE_DISHES from "../data/sampleDishes";
import { useNavigate } from "react-router-dom";
import RecipeDetailModal from "../components/RecipeDetailModal";
import { loadUserRecipes } from "../utils/recipeStorage";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [allDishes, setAllDishes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userRecipes = loadUserRecipes();
    const normalizedUserRecipes = userRecipes.map((r) => ({
      id: r.id,
      name: r.name || "",
      image: r.image || "",
      ingredients: r.ingredients || [],
      instructions: r.instructions || "",
      description: r.description || r.instructions || "",
      cuisine: r.category || "Unknown",
      cookTimeMinutes: r.cookTimeMinutes || 0,
      rating: r.rating || 0,
      user: r.user || "Unknown",
    }));

    const combined = [...SAMPLE_DISHES, ...normalizedUserRecipes];
    setAllDishes(combined);

    const unique = Array.from(new Set(combined.map((d) => d.cuisine)));
    setCategories(unique);
  }, []);

  const openModal = (dish) => {
    setSelectedRecipe(dish);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <NavBar />
      <main className="container">
        <h1 style={{ color: "#ff7f50", marginBottom: "25px" }}>Categories</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => navigate(`/recipes?filter=${cat}`)}
              style={{
                background: "#fff7f1",
                padding: "30px",
                borderRadius: "14px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                cursor: "pointer",
                textAlign: "center",
                fontWeight: "600",
                transition: "0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#ffe7df")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff7f1")}
            >
              {cat}
            </div>
          ))}
        </div>

        {isModalOpen && selectedRecipe && (
          <RecipeDetailModal
            dish={selectedRecipe}
            onClose={closeModal}
            isFav={() => false}
            toggleFav={() => {}}
          />
        )}
      </main>
    </div>
  );
}

export default CategoriesPage;

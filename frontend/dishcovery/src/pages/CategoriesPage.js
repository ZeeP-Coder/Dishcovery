import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import RecipeDetailModal from "../components/RecipeDetailModal";
import { getRecipes } from "../api/backend";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCategories() {
      try {
        const recipesData = await getRecipes();
        
        // Extract categories from recipes
        const categorySet = new Set();
        recipesData.forEach(r => {
          const category = r.category || "Other";
          categorySet.add(category);
        });
        
        const categoriesArray = Array.from(categorySet).sort();
        setCategories(categoriesArray);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setCategories([]);
      }
    }
    
    loadCategories();
  }, []);

  const closeModal = () => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
  };

  return (
    <div className="App" style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <NavBar />
      <main className="container">
        <h1 style={{ color: "#ff7f50", marginBottom: "25px" }}>Categories</h1>
        {categories.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            No recipes available yet. Create your first recipe to get started! 🍽️
          </p>
        ) : (
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
                className="category-card"
              >
                {cat}
              </div>
            ))}
          </div>
        )}

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

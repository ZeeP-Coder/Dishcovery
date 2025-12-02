import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import RecipeDetailModal from "../components/RecipeDetailModal";
import "./MyRecipesPage.css";
import { useNavigate } from "react-router-dom";
import { loadUserRecipes, saveUserRecipes } from "../utils/recipeStorage";
import { apiDelete } from "../api/backend";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("dishcovery:favs") || "[]");
    } catch {
      return [];
    }
  });
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("dishcovery:user"));

  useEffect(() => {
    const allRecipes = loadUserRecipes();
    const userRecipes = allRecipes.filter(r => r.user === currentUser?.email);
    setRecipes(userRecipes);
  }, [currentUser?.email]);

  const handleDelete = async (id, backendId) => {
    // Remove locally
    const allRecipes = loadUserRecipes();
    const updatedRecipes = allRecipes.filter(r => r.id !== id);
    saveUserRecipes(updatedRecipes);
    setRecipes(updatedRecipes.filter(r => r.user === currentUser?.email));

    // Try to delete from backend as well (if it exists there)
    if (backendId) {
      try {
        await apiDelete(`/recipe/deleteRecipe/${backendId}`);
      } catch (err) {
        console.error(err);
        // We keep the local delete, just log backend failure
      }
    }
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
  };

  const toggleFav = (id) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem("dishcovery:favs", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="App">
      <NavBar />
      <main className="container">
        <div className="page-header">
          <h2 className="section-title">My Recipes</h2>
          <button onClick={() => navigate("/create-recipe")} className="btn-add">
            + Add Recipe
          </button>
        </div>

        {recipes.length === 0 ? (
          <p className="empty-message">You haven’t added any recipes yet.</p>
        ) : (
          <div className="myrecipe-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="myrecipe-card">
                {recipe.image && <img src={recipe.image} alt={recipe.name} />}
                <h3>{recipe.name}</h3>
                <p className="small-label"><b>Ingredients: </b>{recipe.ingredients.join(", ")}</p>
                <p className="small-label"><b>Instructions: </b>{recipe.instructions}</p>

                {/* Buttons inline */}
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    className="btn-view"
                    onClick={() => openModal(recipe)}
                    style={{
                      background: "#ff7f50",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      flex: 1
                    }}
                  >
                    View
                  </button>

                  <button
                    className="btn-edit"
                    onClick={() => navigate("/create-recipe", { state: { recipe } })}
                    style={{
                      background: "#36489e",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      flex: 1
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(recipe.id, recipe.backendId)}
                    style={{
                      background: "#d93025",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      flex: 1
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && selectedRecipe && (
          <RecipeDetailModal
            dish={selectedRecipe}
            onClose={closeModal}
            isFav={(id) => favorites.includes(id)}
            toggleFav={toggleFav}
          />
        )}
      </main>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import RecipeDetailModal from "../components/RecipeDetailModal";
import "./MyRecipesPage.css";
import { useNavigate } from "react-router-dom";
import { deleteRecipe, getRecipes } from "../api/backend";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const userStr = sessionStorage.getItem("dishcovery:user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  useEffect(() => {
    if (!currentUser) {
      setRecipes([]);
      return;
    }

    // Fetch recipes from backend and filter by userId
    getRecipes()
      .then((data) => {
        const mapped = (data || []).map((r) => ({
          id: r.recipeId,
          backendId: r.recipeId,
          name: r.title,
          image: r.description,
          ingredients: (typeof r.ingredients === "string" && r.ingredients) ? JSON.parse(r.ingredients) : (r.ingredients || []),
          instructions: r.steps,
          userId: r.userId,
        }));
        const uid = currentUser?.id || currentUser?.userId || currentUser?.user_id;
        const userRecipes = uid ? mapped.filter((r) => r.userId === uid) : [];
        setRecipes(userRecipes);
      })
      .catch((err) => {
        console.error("Failed to fetch recipes:", err);
        alert("Failed to load recipes. Please check the server connection.");
      });
  }, [currentUser]);

  const handleDelete = async (id, backendId) => {
    if (!backendId) {
      alert("Cannot delete recipe without backend ID.");
      return;
    }

    try {
      await deleteRecipe(backendId);
      setRecipes((prev) => prev.filter((r) => r.backendId !== backendId));
      alert("Recipe deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete recipe. Please try again.");
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

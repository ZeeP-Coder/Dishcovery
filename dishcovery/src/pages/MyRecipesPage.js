import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import RecipeDetailModal from "../components/RecipeDetailModal";
import "./MyRecipesPage.css";
import { useNavigate } from "react-router-dom";
import { loadUserRecipes, saveUserRecipes } from "../utils/recipeStorage";
import { apiDelete, apiGet, API_BASE } from "../api/backend";

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
    // try to fetch recipes from backend and filter by userId if available
    apiGet("/recipe/getAllRecipes")
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
        // frontend user object uses `id` (see LoginPage mapping)
        const uid = currentUser?.id || currentUser?.userId || currentUser?.user_id || null;
        const userRecipes = uid ? mapped.filter((r) => r.userId === uid) : mapped;
        setRecipes(userRecipes);
      })
      .catch(() => {
        // fallback to local storage if backend unavailable
        const allRecipes = JSON.parse(localStorage.getItem("dishcovery:recipes")) || [];
        const userRecipes = allRecipes.filter((r) => r.user === currentUser?.email);
        setRecipes(userRecipes);
      });
  }, [currentUser?.id]);

  const handleDelete = async (id, backendId) => {
    // If this recipe exists on backend, delete there first
    if (backendId) {
      try {
        // Use fetch here to capture response status/body for better diagnostics
        const url = `${API_BASE}/recipe/deleteRecipe/${backendId}`;
        const res = await fetch(url, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error(`Delete request failed: ${res.status}`, text);
          alert(`Delete failed: ${res.status} ${text}`);
          return;
        }

        // remove from UI
        setRecipes((prev) => prev.filter((r) => r.backendId !== backendId));
        // also remove any local-storage copies that reference this backendId
        try {
          const saved = loadUserRecipes();
          const updatedSaved = saved.filter((r) => r.backendId !== backendId);
          saveUserRecipes(updatedSaved);
        } catch (e) {
          console.warn("Failed to clean up local storage after backend delete", e);
        }
        // notify other open pages (e.g., HomePage) to refresh their data
        try {
          window.dispatchEvent(new Event("recipesChanged"));
        } catch (e) {
          console.warn("Could not dispatch recipesChanged event", e);
        }
        return;
      } catch (err) {
        console.error("Backend delete failed", err);
        alert("Could not delete recipe on server. Check the console for details.");
        return;
      }
    }

    // Fallback: remove from local storage if no backend id
    const allRecipes = loadUserRecipes();
    const updatedRecipes = allRecipes.filter((r) => r.id !== id);
    saveUserRecipes(updatedRecipes);
    setRecipes(updatedRecipes.filter((r) => r.user === currentUser?.email));
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

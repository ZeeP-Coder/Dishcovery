import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import RecipeDetailModal from "../components/RecipeDetailModal";
import { apiGet, apiPut, apiDelete } from "../api/backend";
import "./AdminPage.css";

function AdminPage() {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [approvedRecipes, setApprovedRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const userStr = sessionStorage.getItem("dishcovery:user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userStr);
    if (!user.isAdmin) {
      // Redirect non-admin users
      navigate("/");
      return;
    }

    loadRecipes();
  }, [navigate]);

  const loadRecipes = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [pending, approved] = await Promise.all([
        apiGet("/recipe/admin/pending"),
        apiGet("/recipe/admin/approved")
      ]);
      setPendingRecipes(pending);
      setApprovedRecipes(approved);
    } catch (err) {
      console.error("Error loading recipes:", err);
      setError("Failed to load recipes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (recipeId) => {
    try {
      await apiPut(`/recipe/admin/approve/${recipeId}`, {});
      // Reload recipes after approval
      await loadRecipes();
    } catch (err) {
      console.error("Error approving recipe:", err);
      setError("Failed to approve recipe. Please try again.");
    }
  };

  const handleReject = async (recipeId) => {
    if (!window.confirm("Are you sure you want to reject this recipe? This action cannot be undone.")) {
      return;
    }

    try {
      await apiDelete(`/recipe/admin/reject/${recipeId}`);
      // Reload recipes after rejection
      await loadRecipes();
    } catch (err) {
      console.error("Error rejecting recipe:", err);
      setError("Failed to reject recipe. Please try again.");
    }
  };

  const handleDeleteApproved = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this approved recipe? This action cannot be undone.")) {
      return;
    }

    try {
      await apiDelete(`/recipe/deleteRecipe/${recipeId}`);
      // Reload recipes after deletion
      await loadRecipes();
    } catch (err) {
      console.error("Error deleting recipe:", err);
      setError("Failed to delete recipe. Please try again.");
    }
  };

  const RecipeCard = ({ recipe, isPending }) => {
    let ingredients = [];
    try {
      if (recipe.ingredients) {
        const parsed = JSON.parse(recipe.ingredients);
        // Filter out empty ingredients (just dashes or empty strings)
        ingredients = parsed.filter(ing => {
          const name = typeof ing === 'string' ? ing : ing.name;
          return name && name.trim() && name.trim() !== '-';
        });
      }
    } catch (e) {
      console.error("Error parsing ingredients:", e);
      ingredients = [];
    }
    
    return (
      <div className="admin-recipe-card" style={{ position: 'relative', paddingBottom: '70px' }}>
        <div className="recipe-header">
          <h3>{recipe.title}</h3>
          <span className="recipe-category">{recipe.category || "Uncategorized"}</span>
        </div>
        
        <div className="recipe-info">
          <p><strong>User ID:</strong> {recipe.userId}</p>
          <p><strong>Description:</strong> {recipe.description || "No description"}</p>
        </div>

        <div className="recipe-ingredients">
          <strong>Ingredients:</strong>
          {ingredients.length > 0 ? (
            <ul>
              {ingredients.map((ing, idx) => {
                const name = typeof ing === 'string' ? ing : ing.name;
                const quantity = typeof ing === 'object' ? ing.quantity : '';
                return (
                  <li key={idx}>
                    {name} {quantity && `- ${quantity}`}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', margin: '0.5rem 0' }}>
              No ingredients listed
            </p>
          )}
        </div>

        <div className="recipe-steps">
          <strong>Steps:</strong>
          <p>{recipe.steps || "No steps provided"}</p>
        </div>

        <div className="recipe-actions" style={{ 
          position: 'absolute', 
          bottom: '14px', 
          left: '14px', 
          right: '14px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'space-between'
        }}>
          {isPending ? (
            <>
              <button 
                className="btn-approve" 
                onClick={() => handleApprove(recipe.recipeId)}
              >
                ✓ Approve
              </button>
              <button 
                className="btn-reject" 
                onClick={() => handleReject(recipe.recipeId)}
              >
                ✗ Reject
              </button>
            </>
          ) : (
            <>
              <button 
                className="btn-view" 
                onClick={() => {
                  // Parse ingredients for the modal
                  let parsedIngredients = [];
                  try {
                    if (recipe.ingredients) {
                      const parsed = JSON.parse(recipe.ingredients);
                      parsedIngredients = parsed
                        .filter(ing => {
                          const name = typeof ing === 'string' ? ing : ing.name;
                          return name && name.trim() && name.trim() !== '-';
                        })
                        .map(ing => typeof ing === 'string' ? ing : ing.name);
                    }
                  } catch (e) {
                    console.error("Error parsing ingredients:", e);
                    parsedIngredients = [];
                  }
                  
                  // Convert recipe to the format expected by RecipeDetailModal
                  const mappedRecipe = {
                    id: recipe.recipeId,
                    name: recipe.title,
                    image: recipe.imageUrl,
                    description: recipe.description,
                    cuisine: recipe.category || "",
                    ingredients: parsedIngredients,
                    instructions: recipe.steps,
                    cookTimeMinutes: 45,
                    difficulty: "Medium",
                    rating: 0
                  };
                  setSelectedRecipe(mappedRecipe);
                }}
              >
                👁 View
              </button>
              <button 
                className="btn-delete" 
                onClick={() => handleDeleteApproved(recipe.recipeId)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-page">
      <NavBar />
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        
        {error && <div className="error-banner">{error}</div>}
        
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Recipes ({pendingRecipes.length})
          </button>
          <button 
            className={`tab-button ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved Recipes ({approvedRecipes.length})
          </button>
        </div>

        {isLoading ? (
          <div className="loading">Loading recipes...</div>
        ) : (
          <div className="recipes-grid">
            {activeTab === "pending" ? (
              pendingRecipes.length === 0 ? (
                <p className="no-recipes">No pending recipes to review.</p>
              ) : (
                pendingRecipes.map(recipe => (
                  <RecipeCard key={recipe.recipeId} recipe={recipe} isPending={true} />
                ))
              )
            ) : (
              approvedRecipes.length === 0 ? (
                <p className="no-recipes">No approved recipes yet.</p>
              ) : (
                approvedRecipes.map(recipe => (
                  <RecipeCard key={recipe.recipeId} recipe={recipe} isPending={false} />
                ))
              )
            )}
          </div>
        )}
      </div>

      {selectedRecipe && (
        <RecipeDetailModal
          dish={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          toggleFav={() => {}} // Admin doesn't use favorites
          isFav={false}
        />
      )}
    </div>
  );
}

export default AdminPage;

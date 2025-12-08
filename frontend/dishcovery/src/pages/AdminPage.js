import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { apiGet, apiPut, apiDelete } from "../api/backend";
import "./AdminPage.css";

function AdminPage() {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [approvedRecipes, setApprovedRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
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
    const ingredients = recipe.ingredients ? JSON.parse(recipe.ingredients) : [];
    
    return (
      <div className="admin-recipe-card">
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
          <ul>
            {ingredients.map((ing, idx) => (
              <li key={idx}>{ing.name} - {ing.quantity}</li>
            ))}
          </ul>
        </div>

        <div className="recipe-steps">
          <strong>Steps:</strong>
          <p>{recipe.steps || "No steps provided"}</p>
        </div>

        <div className="recipe-actions">
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
            <button 
              className="btn-delete" 
              onClick={() => handleDeleteApproved(recipe.recipeId)}
            >
              Delete
            </button>
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
    </div>
  );
}

export default AdminPage;

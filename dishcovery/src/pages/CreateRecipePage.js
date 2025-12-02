import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../pages/CreateRecipePage.css";
import { loadUserRecipes, saveUserRecipes } from "../utils/recipeStorage";
import { apiPost, apiPut } from "../api/backend";

function CreateRecipePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingRecipe = location.state?.recipe;

  const [recipe, setRecipe] = useState({
    name: "",
    image: "",
    ingredients: [],
    instructions: "",
    category: "",
    id: editingRecipe?.id || Date.now(),
    user: editingRecipe?.user || JSON.parse(localStorage.getItem("dishcovery:user"))?.email,
    backendId: editingRecipe?.backendId || null,
  });

  const [ingredientInput, setIngredientInput] = useState("");

  useEffect(() => {
    if (editingRecipe) setRecipe(editingRecipe);
  }, [editingRecipe]);

  const addIngredient = () => {
    if (!ingredientInput.trim()) return;
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ingredientInput.trim()] });
    setIngredientInput("");
  };

  const removeIngredient = (index) => {
    setRecipe({ ...recipe, ingredients: recipe.ingredients.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    if (!recipe.name || !recipe.category || recipe.ingredients.length === 0) {
      alert("Please complete all required fields.");
      return;
    }

    // Mirror recipe into backend (MySQL) using minimal fields that exist in RecipeEntity
    try {
      const currentUser = JSON.parse(localStorage.getItem("dishcovery:user"));
      const userId = currentUser?.id || 0;
      const payload = {
        recipe_Id: recipe.backendId || 0,
        title: recipe.name,
        description: recipe.instructions || "",
        steps: recipe.instructions || "",
        user_Id: userId,
      };

      let backendRecipe = null;
      if (recipe.backendId) {
        // Update existing recipe in backend
        backendRecipe = await apiPut(
          `/recipe/updateRecipe?recipeId=${recipe.backendId}`,
          payload
        );
      } else {
        // Create new recipe in backend
        backendRecipe = await apiPost("/recipe/insertRecipe", payload);
      }

      const backendId = backendRecipe?.recipe_Id || recipe.backendId || null;

      // Sync to local storage as before, but keep backendId for future edits/deletes
      const saved = loadUserRecipes();
      const exists = saved.find((r) => r.id === recipe.id);
      const nextRecipe = { ...recipe, backendId };
      const updated = exists
        ? saved.map((r) => (r.id === recipe.id ? nextRecipe : r))
        : [...saved, nextRecipe];

      saveUserRecipes(updated);
      navigate("/my-recipes");
    } catch (err) {
      console.error(err);
      alert("Saving recipe to the server failed. Please try again.");
    }
  };

  return (
    <div className="create-recipe-page">
      <div className="create-recipe-container">
        <div className="header-row">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <h2>{editingRecipe ? "Edit Recipe" : "Create Recipe"}</h2>
        </div>

        <input
          type="text"
          placeholder="Recipe Name"
          value={recipe.name}
          onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={recipe.image}
          onChange={(e) => setRecipe({ ...recipe, image: e.target.value })}
        />
        <select
          value={recipe.category}
          onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
          className="category-select"
        >
          <option value="">Select Category</option>
          <option value="Filipino">Filipino</option>
          <option value="Italian">Italian</option>
          <option value="Japanese">Japanese</option>
          <option value="Korean">Korean</option>
          <option value="American">American</option>
          <option value="Chinese">Chinese</option>
        </select>

        <div className="ingredient-section">
          <input
            type="text"
            placeholder="Add Ingredient"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
          />
          <button className="btn-accent" onClick={addIngredient}>Add</button>
        </div>

        <ul className="ingredient-list">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} onClick={() => removeIngredient(i)}>{ing}</li>
          ))}
        </ul>

        <textarea
          placeholder="Cooking Instructions"
          value={recipe.instructions}
          onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
        />

        <button className="btn-primary" onClick={handleSave}>
          {editingRecipe ? "Update Recipe" : "Save Recipe"}
        </button>
      </div>
    </div>
  );
}

export default CreateRecipePage;

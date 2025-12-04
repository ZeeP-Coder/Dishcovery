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

    const payload = {
      title: recipe.name,
      description: recipe.image || recipe.category,
      steps: recipe.instructions,
      // Use the logged-in user's id if available
      userId: JSON.parse(localStorage.getItem("dishcovery:user"))?.id || JSON.parse(localStorage.getItem("dishcovery:user"))?.userId || 1,
      ingredients: recipe.ingredients
    };

    // send to backend
    try {
      if (editingRecipe && editingRecipe.backendId) {
        // update existing recipe on backend
        const payloadToSend = { ...payload, ingredients: JSON.stringify(payload.ingredients || []) };
        await apiPut(`/recipe/updateRecipe/${editingRecipe.backendId}`, payloadToSend);
        // update local storage copy if present
        const saved = JSON.parse(localStorage.getItem("dishcovery:recipes") || "[]");
        const updated = saved.map((r) => (r.id === recipe.id ? { ...r, ...recipe } : r));
        localStorage.setItem("dishcovery:recipes", JSON.stringify(updated));
        navigate("/myrecipes");
        return;
      }

      const payloadToSend = { ...payload, ingredients: JSON.stringify(payload.ingredients || []) };
      const data = await apiPost("/recipe/insertRecipe", payloadToSend);
      // optionally store locally as well, include backend id
      const saved = JSON.parse(localStorage.getItem("dishcovery:recipes") || "[]");
      const updated = [...saved, { ...recipe, id: data.recipeId, backendId: data.recipeId }];
      localStorage.setItem("dishcovery:recipes", JSON.stringify(updated));
      navigate("/myrecipes");
    } catch (err) {
      console.error(err);
      alert("Could not save recipe to server.");
    }
  }

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

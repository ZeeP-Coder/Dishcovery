import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/CreateRecipePage.css";

function CreateRecipePage() {
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState({
    name: "",
    image: "",
    ingredients: [],
    instructions: "",
    category: "",
  });

  const [ingredientInput, setIngredientInput] = useState("");

  function addIngredient() {
    if (!ingredientInput.trim()) return;
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, ingredientInput.trim()],
    });
    setIngredientInput("");
  }

  function removeIngredient(index) {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((_, i) => i !== index),
    });
  }

  function handleSave() {
    if (!recipe.name || !recipe.category || recipe.ingredients.length === 0) {
      alert("Please complete all required fields.");
      return;
    }

    const newRecipe = {
      ...recipe,
      cuisine: recipe.category, // IMPORTANT FIX 🔥 ensures filtering works
      id: Date.now(),
    };

    const saved = JSON.parse(localStorage.getItem("dishcovery:recipes") || "[]");

    const updated = [...saved, newRecipe];
    localStorage.setItem("dishcovery:recipes", JSON.stringify(updated));

    navigate("/myrecipes");
  }

  return (
    <div className="create-recipe-page">
      <div className="create-recipe-container">
        <div className="header-row">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <h2>Create Recipe</h2>
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
          <button className="btn-accent" onClick={addIngredient}>
            Add
          </button>
        </div>

        <ul className="ingredient-list">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} onClick={() => removeIngredient(i)}>
              {ing}
            </li>
          ))}
        </ul>

        <textarea
          placeholder="Cooking Instructions"
          value={recipe.instructions}
          onChange={(e) =>
            setRecipe({ ...recipe, instructions: e.target.value })
          }
        />

        <button className="btn-primary" onClick={handleSave}>
          Save Recipe
        </button>
      </div>
    </div>
  );
}

export default CreateRecipePage;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../pages/CreateRecipePage.css";
import { loadUserRecipes, saveUserRecipes } from "../utils/recipeStorage";

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [ingredientInput, setIngredientInput] = useState("");

  useEffect(() => {
    const allRecipes = loadUserRecipes();
    const found = allRecipes.find((r) => r.id === Number(id));
    setRecipe(found);
  }, [id]);

  if (!recipe) return <p>Loading...</p>;

  const addIngredient = () => {
    if (!ingredientInput.trim()) return;

    // Parse ingredient format: "Name - Quantity" or just "Name"
    const input = ingredientInput.trim();
    const parts = input.split('-').map(p => p.trim());
    
    let ingredientObj;
    if (parts.length >= 2) {
      // Has quantity: "Pancit - 1"
      ingredientObj = {
        name: parts[0],
        quantity: parts.slice(1).join('-').trim()
      };
    } else {
      // No quantity, just name
      ingredientObj = {
        name: input,
        quantity: ""
      };
    }

    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, ingredientObj],
    });

    setIngredientInput("");
  };

  const removeIngredient = (index) => {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((_, i) => i !== index),
    });
  };

  const handleUpdate = () => {
    const allRecipes = loadUserRecipes();
    const updated = allRecipes.map((r) =>
      r.id === recipe.id ? recipe : r
    );

    saveUserRecipes(updated);

    navigate("/my-recipes");
  };

  return (
    <div className="create-recipe-page">
      <div className="create-recipe-container">
        <div className="header-row">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <h2>Edit Recipe</h2>
        </div>

        <input
          type="text"
          value={recipe.name}
          onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
        />

        <input
          type="text"
          value={recipe.image}
          onChange={(e) => setRecipe({ ...recipe, image: e.target.value })}
        />

        <select
          value={recipe.category}
          onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
        >
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
            placeholder="e.g., Pancit - 1 or Tomato sauce - 2 cups"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
          />
          <button className="btn-accent" onClick={addIngredient}>
            Add
          </button>
        </div>

        <ul className="ingredient-list">
          {recipe.ingredients.map((ing, i) => {
            const displayText = typeof ing === 'string' 
              ? ing 
              : (ing.quantity ? `${ing.name} - ${ing.quantity}` : ing.name);
            return (
              <li key={i} onClick={() => removeIngredient(i)}>
                {displayText}
              </li>
            );
          })}
        </ul>

        <textarea
          value={recipe.instructions}
          onChange={(e) =>
            setRecipe({ ...recipe, instructions: e.target.value })
          }
        />

        <button className="btn-primary" onClick={handleUpdate}>
          Update Recipe
        </button>
      </div>
    </div>
  );
}

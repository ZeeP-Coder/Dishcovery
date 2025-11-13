import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./CreateRecipePage.css";

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: "",
    instructions: "",
    image: "",
    ingredients: [],
  });
  const [ingredient, setIngredient] = useState("");
  const [error, setError] = useState("");

  const addIngredient = () => {
    if (!ingredient.trim()) return;
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ingredient] });
    setIngredient("");
  };

  const handleSave = () => {
    if (!recipe.name || !recipe.instructions) {
      setError("Please fill all required fields.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("dishcovery:user"));
    const allRecipes = JSON.parse(localStorage.getItem("dishcovery:recipes")) || [];

    const newRecipe = {
      ...recipe,
      id: Date.now(),
      user: currentUser?.email || "unknown",
    };

    localStorage.setItem("dishcovery:recipes", JSON.stringify([...allRecipes, newRecipe]));
    navigate("/my-recipes");
  };

  return (
    <div className="create-recipe-page">
      <NavBar />
      <div className="create-recipe-container">
        <div className="header-row">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Home
          </button>
          <h2>Create New Recipe</h2>
        </div>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Recipe Name"
          value={recipe.name}
          onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
        />

        <textarea
          placeholder="Instructions"
          value={recipe.instructions}
          onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
        />

        <input
          type="text"
          placeholder="Image URL (optional)"
          value={recipe.image}
          onChange={(e) => setRecipe({ ...recipe, image: e.target.value })}
        />

        <div className="ingredient-section">
          <input
            type="text"
            placeholder="Add Ingredient"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
          />
          <button className="btn-accent" onClick={addIngredient}>
            Add
          </button>
        </div>

        {recipe.ingredients.length > 0 && (
          <ul className="ingredient-list">
            {recipe.ingredients.map((ing, index) => (
              <li key={index}>{ing}</li>
            ))}
          </ul>
        )}

        <button className="btn-primary save-btn" onClick={handleSave}>
          Save Recipe
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../pages/CreateRecipePage.css";
import { apiGet, apiPut } from "../api/backend";

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [ingredientInput, setIngredientInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await apiGet(`/recipe/getRecipe/${id}`);
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        alert("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found</p>;

  const addIngredient = () => {
    if (!ingredientInput.trim()) return;

    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, ingredientInput.trim()],
    });

    setIngredientInput("");
  };

  const removeIngredient = (index) => {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((_, i) => i !== index),
    });
  };

  const handleUpdate = async () => {
    try {
      await apiPut(`/recipe/updateRecipe/${recipe.recipeId}`, recipe);
      alert("Recipe updated successfully!");
      navigate("/my-recipes");
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe");
    }
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

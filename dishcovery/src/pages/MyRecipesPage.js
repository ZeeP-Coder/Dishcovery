import React, { useEffect, useState } from "react";
import "./MyRecipesPage.css";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("dishcovery:user"));

  useEffect(() => {
    const allRecipes = JSON.parse(localStorage.getItem("dishcovery:recipes")) || [];
    const userRecipes = allRecipes.filter(r => r.user === currentUser?.email);
    setRecipes(userRecipes);
  }, []);

  const handleDelete = (id) => {
    const allRecipes = JSON.parse(localStorage.getItem("dishcovery:recipes")) || [];
    const updatedRecipes = allRecipes.filter(r => r.id !== id);
    localStorage.setItem("dishcovery:recipes", JSON.stringify(updatedRecipes));
    setRecipes(recipes.filter(r => r.id !== id));
  };

  return (
    <div className="my-recipes-container">
      <h2>My Recipes</h2>

      {recipes.length === 0 ? (
        <p>You haven’t added any recipes yet.</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              {recipe.image && <img src={recipe.image} alt={recipe.name} />}
              <h3>{recipe.name}</h3>
              <p><b>Ingredients:</b> {recipe.ingredients.join(", ")}</p>
              <p><b>Instructions:</b> {recipe.instructions}</p>
              <button className="btn-delete" onClick={() => handleDelete(recipe.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar"; 
import "./MyRecipesPage.css";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("dishcovery:user"));

  useEffect(() => {
  const allRecipes =
    JSON.parse(localStorage.getItem("dishcovery:recipes")) || [];
  const userRecipes = allRecipes.filter(
    (r) => r.user === currentUser?.email
  );
  setRecipes(userRecipes);
}, [currentUser?.email]);

  const handleDelete = (id) => {
    const allRecipes =
      JSON.parse(localStorage.getItem("dishcovery:recipes")) || [];
    const updatedRecipes = allRecipes.filter((r) => r.id !== id);

    localStorage.setItem("dishcovery:recipes", JSON.stringify(updatedRecipes));
    setRecipes(updatedRecipes);
  };

  return (
    <div className="App">
      <NavBar />
      <main className="container">
        <div className="page-header">
          <h2 className="section-title">My Recipes</h2>

          <button
            onClick={() => navigate("/create-recipe")}
            className="btn-add"
          >
            + Add Recipe
          </button>
        </div>

        {recipes.length === 0 ? (
          <p className="empty-message">
            You haven’t added any recipes yet.
          </p>
        ) : (
          <div className="myrecipe-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="myrecipe-card">
                {recipe.image && (
                  <img src={recipe.image} alt={recipe.name} />
                )}

                <h3>{recipe.name}</h3>

                <p className="small-label">
                  <b>Ingredients: </b>
                  {recipe.ingredients.join(", ")}
                </p>

                <p className="small-label">
                  <b>Instructions:</b> {recipe.instructions}
                </p>

                <button
                  className="btn-delete"
                  onClick={() => handleDelete(recipe.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

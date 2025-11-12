import React, { useState, useEffect } from "react";
import "./AdminRecipePage.css";

export default function AdminRecipePage({ userRecipes = [] }) {
  // Initially show user recipes + admin-added recipes
  const [recipes, setRecipes] = useState([]);

  const [newRecipe, setNewRecipe] = useState({ name: "", ingredients: "", instructions: "", image: "" });
  const [editingRecipe, setEditingRecipe] = useState(null);

  // Load user recipes on mount
  useEffect(() => {
    // Combine userRecipes with any admin-added recipes
    setRecipes(userRecipes);
  }, [userRecipes]);

  // Add a new recipe (admin can add)
  const handleAdd = () => {
    const nextId = recipes.length ? Math.max(...recipes.map(r => r.id)) + 1 : 1;
    setRecipes([...recipes, { ...newRecipe, id: nextId }]);
    setNewRecipe({ name: "", ingredients: "", instructions: "", image: "" });
  };

  // Remove recipe
  const handleRemove = (id) => setRecipes(recipes.filter(r => r.id !== id));

  // Edit recipe
  const handleEdit = (recipe) => setEditingRecipe(recipe);

  const handleSave = () => {
    setRecipes(recipes.map(r => r.id === editingRecipe.id ? editingRecipe : r));
    setEditingRecipe(null);
  };

  return (
    <div className="admin-recipes-container">
      <h2 className="admin-page-title">Admin - Manage Recipes</h2>

      {/* Add New Recipe */}
      <div className="admin-card add-recipe-card">
        <h3>Add New Recipe</h3>
        <input
          placeholder="Name"
          value={newRecipe.name}
          onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
        />
        <input
          placeholder="Ingredients"
          value={newRecipe.ingredients}
          onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
        />
        <input
          placeholder="Instructions"
          value={newRecipe.instructions}
          onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
        />
        <input
          placeholder="Image URL"
          value={newRecipe.image}
          onChange={(e) => setNewRecipe({ ...newRecipe, image: e.target.value })}
        />
        <button className="btn-primary" onClick={handleAdd}>Add Recipe</button>
      </div>

      {/* Recipe List */}
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="admin-card recipe-card">
            {recipe.image && <img src={recipe.image} alt={recipe.name} className="recipe-img" />}
            <h4>{recipe.name}</h4>
            <p><b>Ingredients:</b> {recipe.ingredients}</p>
            <p><b>Instructions:</b> {recipe.instructions}</p>
            <div className="recipe-card-buttons">
              <button className="btn-accent" onClick={() => handleEdit(recipe)}>Edit</button>
              <button className="btn-delete" onClick={() => handleRemove(recipe.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingRecipe && (
        <div className="edit-modal">
          <div className="edit-modal-card">
            <h3>Edit Recipe</h3>
            <input
              value={editingRecipe.name}
              onChange={(e) => setEditingRecipe({ ...editingRecipe, name: e.target.value })}
            />
            <input
              value={editingRecipe.ingredients}
              onChange={(e) => setEditingRecipe({ ...editingRecipe, ingredients: e.target.value })}
            />
            <input
              value={editingRecipe.instructions}
              onChange={(e) => setEditingRecipe({ ...editingRecipe, instructions: e.target.value })}
            />
            <input
              value={editingRecipe.image}
              onChange={(e) => setEditingRecipe({ ...editingRecipe, image: e.target.value })}
            />
            <div className="edit-modal-buttons">
              <button className="btn-success" onClick={handleSave}>Save</button>
              <button className="btn-delete" onClick={() => setEditingRecipe(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

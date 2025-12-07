import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../pages/CreateRecipePage.css";
import { apiPost, apiPut } from "../api/backend";

function CreateRecipePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingRecipe = location.state?.recipe;

  const [recipe, setRecipe] = useState({
    name: "",
    image: "",
    imagePreview: "",
    ingredients: [],
    instructions: "",
    category: "",
    id: editingRecipe?.id || Date.now(),
    backendId: editingRecipe?.backendId || null,
  });

  const [ingredientInput, setIngredientInput] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (editingRecipe) setRecipe(editingRecipe);
  }, [editingRecipe]);

  const validateForm = () => {
    const newErrors = {};

    if (!recipe.name.trim()) {
      newErrors.name = "Recipe name is required";
    } else if (recipe.name.length < 3) {
      newErrors.name = "Recipe name must be at least 3 characters";
    }

    if (!recipe.category) {
      newErrors.category = "Please select a category";
    }

    if (recipe.ingredients.length === 0) {
      newErrors.ingredients = "Add at least one ingredient";
    }

    if (!recipe.instructions.trim()) {
      newErrors.instructions = "Cooking instructions are required";
    } else if (recipe.instructions.length < 10) {
      newErrors.instructions = "Instructions must be at least 10 characters";
    }

    if (recipe.image && !isValidUrl(recipe.image)) {
      newErrors.image = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, image: 'Please select an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: 'Image must be less than 5MB' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRecipe({
        ...recipe,
        image: file,
        imagePreview: reader.result
      });
      setErrors({ ...errors, image: null });
    };
    reader.readAsDataURL(file);
  };

  const addIngredient = () => {
    if (!ingredientInput.trim()) return;
    if (recipe.ingredients.includes(ingredientInput.trim())) {
      alert("This ingredient is already added");
      return;
    }
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ingredientInput.trim()] });
    setIngredientInput("");
  };

  const removeIngredient = (index) => {
    setRecipe({ ...recipe, ingredients: recipe.ingredients.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Get user ID from session storage (set during login)
    const userStr = sessionStorage.getItem("dishcovery:user");
    if (!userStr) {
      setServerError("User not logged in. Please log in first.");
      return;
    }
    
    let userObj;
    try {
      userObj = JSON.parse(userStr);
    } catch (e) {
      setServerError("Invalid user session. Please log in again.");
      return;
    }
    
    // Try to extract userId from various possible field names
    let userId = userObj?.id || userObj?.userId || userObj?.user_id;
    
    // If still no userId, log what we got and inform user
    if (!userId && userObj) {
      console.warn("Could not find userId in user object:", userObj);
      setServerError("Invalid user information. Please log in again.");
      return;
    }
    
    if (!userId) {
      setServerError("User not logged in. Please log in first.");
      return;
    }
    
    // Ensure userId is a number
    userId = parseInt(userId, 10);
    if (isNaN(userId)) {
      setServerError("Invalid user ID. Please log in again.");
      return;
    }

    const payload = {
      title: recipe.name,
      description: recipe.image || recipe.category,
      steps: recipe.instructions,
      userId: userId,
      ingredients: recipe.ingredients,
      category: recipe.category
    };

    setIsLoading(true);
    setServerError("");
    try {
      if (editingRecipe && editingRecipe.backendId) {
        // update existing recipe on backend
        const payloadToSend = { ...payload, ingredients: JSON.stringify(payload.ingredients || []) };
        await apiPut(`/recipe/updateRecipe/${editingRecipe.backendId}`, payloadToSend);
        setIsLoading(false);
        navigate("/myrecipes");
        return;
      }

      const payloadToSend = { ...payload, ingredients: JSON.stringify(payload.ingredients || []) };
      const data = await apiPost("/recipe/insertRecipe", payloadToSend);
      
      // Verify we got a valid response
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response from server");
      }
      
      const recipeId = data.recipeId || data.id;
      if (!recipeId) {
        throw new Error("Server did not return a recipe ID");
      }
      
      setIsLoading(false);
      navigate("/myrecipes");
    } catch (err) {
      console.error("Error details:", err);
      setServerError(`Could not save recipe: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addIngredient();
    }
  };

  return (
    <div className="create-recipe-page">
      <div className="create-recipe-container">
        <div className="header-row">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <h2>{editingRecipe ? "Edit Recipe" : "Create Recipe"}</h2>
        </div>

        {serverError && <div className="error-banner">{serverError}</div>}

        <div className="form-group">
          <label>Recipe Name *</label>
          <input
            type="text"
            placeholder="e.g., Spaghetti Carbonara"
            value={recipe.name}
            onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={recipe.image}
            onChange={(e) => setRecipe({ ...recipe, image: e.target.value })}
            className={errors.image ? "input-error" : ""}
          />
          {errors.image && <span className="error-text">{errors.image}</span>}
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            value={recipe.category}
            onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
            className={`category-select ${errors.category ? "input-error" : ""}`}
          >
            <option value="">Select Category</option>
            <option value="Filipino">Filipino</option>
            <option value="Italian">Italian</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="American">American</option>
            <option value="Chinese">Chinese</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label>Ingredients * ({recipe.ingredients.length})</label>
          <div className="ingredient-section">
            <input
              type="text"
              placeholder="Add ingredient..."
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="btn-accent" onClick={addIngredient} type="button">Add</button>
          </div>
          {errors.ingredients && <span className="error-text">{errors.ingredients}</span>}

          {recipe.ingredients.length > 0 && (
            <ul className="ingredient-list">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="ingredient-item">
                  {ing}
                  <button
                    type="button"
                    className="ingredient-remove"
                    onClick={() => removeIngredient(i)}
                    title="Remove"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <label>Cooking Instructions * ({recipe.instructions.length} chars)</label>
          <textarea
            placeholder="Describe how to cook this recipe..."
            value={recipe.instructions}
            onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
            className={errors.instructions ? "input-error" : ""}
          />
          {errors.instructions && <span className="error-text">{errors.instructions}</span>}
        </div>

        <button className="btn-primary" onClick={handleSave} disabled={isLoading}>
          {isLoading ? (editingRecipe ? "Updating..." : "Saving...") : (editingRecipe ? "Update Recipe" : "Save Recipe")}
        </button>
      </div>
    </div>
  );
}

export default CreateRecipePage;

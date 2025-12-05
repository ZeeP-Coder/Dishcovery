const API_BASE = "http://localhost:8080";

export { API_BASE };

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(res);
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return handleResponse(res);
}

// ===== COMMENT API =====
export async function getComments() {
  return apiGet("/comment/getAllComments");
}

export async function addComment(body) {
  return apiPost("/comment/insertComment", body);
}

export async function updateComment(commentId, body) {
  return apiPut(`/comment/updateComment?commentId=${commentId}`, body);
}

export async function deleteComment(commentId) {
  return apiDelete(`/comment/deleteComment/${commentId}`);
}

// ===== RATING API =====
export async function getRatings() {
  return apiGet("/rating/getAllRatings");
}

export async function addRating(body) {
  return apiPost("/rating/insertRating", body);
}

export async function updateRating(ratingId, body) {
  return apiPut(`/rating/updateRating?ratingId=${ratingId}`, body);
}

export async function deleteRating(ratingId) {
  return apiDelete(`/rating/deleteRating/${ratingId}`);
}

// ===== INGREDIENT API =====
export async function getIngredients() {
  return apiGet("/ingredients");
}

export async function getIngredientById(id) {
  return apiGet(`/ingredients/${id}`);
}

export async function addIngredient(body) {
  return apiPost("/ingredients", body);
}

export async function updateIngredient(id, body) {
  return apiPut(`/ingredients/${id}`, body);
}

export async function deleteIngredient(id) {
  return apiDelete(`/ingredients/${id}`);
}

// ===== RECIPE API =====
export async function getRecipes() {
  return apiGet("/recipe/getAllRecipes");
}

export async function addRecipe(body) {
  return apiPost("/recipe/insertRecipe", body);
}

export async function updateRecipe(recipeId, body) {
  return apiPut(`/recipe/updateRecipe/${recipeId}`, body);
}

export async function deleteRecipe(recipeId) {
  return apiDelete(`/recipe/deleteRecipe/${recipeId}`);
}


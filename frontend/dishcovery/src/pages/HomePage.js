import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import NavBar from "../components/NavBar";
import HeroBanner from "../components/HeroBanner";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import PriceFilter from "../components/PriceFilter";
import RecipeGrid from "../components/RecipeGrid";
import RecipeDetailModal from "../components/RecipeDetailModal";
import { apiGet } from "../api/backend";
import { getUserFavorites, addFavorite, deleteFavorite } from "../api/backend";

export default function HomePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState({ minPrice: null, maxPrice: null });
  const [favorites, setFavorites] = useState([]);
  const [backendDishes, setBackendDishes] = useState(null);
  const [backendError, setBackendError] = useState(null);

  const normalizeRecipe = (r) => ({
    id: r.id,
    name: r.name || "Untitled",
    image: r.image || "",
    // Prefer explicit cuisine, then category (used by created recipes),
    // so new recipes appear under the correct category (e.g., "Italian").
    cuisine: r.cuisine || r.category || "Other",
    ingredients: Array.isArray(r.ingredients)
      ? r.ingredients.map((i) => (typeof i === "string" ? { name: i } : i))
      : [],
    // Use description if present, otherwise fall back to instructions
    description: r.description || r.instructions || "",
    instructions: r.instructions || "",
    cookTimeMinutes: r.cookTimeMinutes || null,
    difficulty: r.difficulty || null,
    estimatedPrice: r.estimatedPrice || null,
    isUserMade: !!r.user,
    original: r,
  });

  const allDishes = useMemo(() => {
    // Load from backend recipes, will be updated in useEffect
    return backendDishes || [];
  }, [backendDishes]);

  // Fetch backend recipes and merge with sample dishes; fallback to local-storage if backend unavailable
  useEffect(() => {
    let mounted = true;
    const fetchBackend = async () => {
      try {
        setBackendError(null);
        const data = await apiGet("/recipe/getAllRecipes");
        if (!mounted) return;
        const mapped = (data || []).map((r) => ({
          id: r.recipeId,
          backendId: r.recipeId,
          name: r.title,
          image: r.image,
          cuisine: r.category || r.cuisine || "Other",
          ingredients: (typeof r.ingredients === "string" && r.ingredients) ? JSON.parse(r.ingredients) : (r.ingredients || []),
          description: r.description || "",
          instructions: r.steps || "",
          cookTimeMinutes: r.cookTimeMinutes || null,
          difficulty: r.difficulty || null,
          estimatedPrice: r.estimatedPrice || null,
          user: r.userId,
          isUserMade: true
        }));
        setBackendDishes(mapped);
      } catch (err) {
        console.error("Failed to fetch backend recipes:", err);
        if (!mounted) return;
        setBackendError("Failed to load recipes. Please check the server connection.");
        setBackendDishes(null);
      }
      
      // Fetch user favorites
      try {
        const userStr = sessionStorage.getItem("dishcovery:user");
        if (userStr) {
          const user = JSON.parse(userStr);
          const userId = user?.id;
          if (userId) {
            const favoritesData = await getUserFavorites(userId);
            if (!mounted) return;
            const favoriteRecipeIds = favoritesData.map(fav => fav.recipeId);
            setFavorites(favoriteRecipeIds);
          }
        }
      } catch (err) {
        console.warn("Could not fetch favorites", err);
      }
    };

    fetchBackend();

    const onRecipesChanged = () => {
      fetchBackend();
    };
    window.addEventListener("recipesChanged", onRecipesChanged);

    return () => {
      mounted = false;
      window.removeEventListener("recipesChanged", onRecipesChanged);
    };
  }, []);

  // Build effective list by preferring backend dishes when available and merging with sample
  const effectiveDishes = useMemo(() => {
    const sampleAndLocal = allDishes;
    if (!backendDishes) return sampleAndLocal;
    // backend dishes should replace any local/user-made entries that share backendId
    const backendMap = new Map(backendDishes.map((d) => [d.backendId, d]));
    // include backend dishes first
    const backendList = backendDishes.map(normalizeRecipe);
    // include sample/local dishes that don't exist on backend
    const others = sampleAndLocal.filter((d) => !d.backendId || !backendMap.has(d.backendId));
    return [...backendList, ...others];
  }, [allDishes, backendDishes]);

  const cuisines = useMemo(() => {
    const set = new Set(effectiveDishes.map((d) => d.cuisine));
    return ["All", ...Array.from(set)];
  }, [effectiveDishes]);

  const filteredDishes = useMemo(() => {
    const s = search.trim().toLowerCase();
    return effectiveDishes.filter((d) => {
      if (cuisineFilter !== "All" && d.cuisine !== cuisineFilter) return false;
      
      // Price filter
      if (priceFilter.minPrice !== null && (d.estimatedPrice === null || d.estimatedPrice < priceFilter.minPrice)) return false;
      if (priceFilter.maxPrice !== null && (d.estimatedPrice === null || d.estimatedPrice > priceFilter.maxPrice)) return false;
      
      if (!s) return true;
      if (d.name.toLowerCase().includes(s)) return true;
      if (d.cuisine.toLowerCase().includes(s)) return true;
      if (d.instructions.toLowerCase().includes(s)) return true;
      if (Array.isArray(d.ingredients) && d.ingredients.some((i) => (i?.name || "").toLowerCase().includes(s))) return true;
      return false;
    });
  }, [search, cuisineFilter, priceFilter, effectiveDishes]);

  async function toggleFav(recipeId) {
    try {
      const userStr = sessionStorage.getItem("dishcovery:user");
      if (!userStr) {
        alert("Please log in to add favorites");
        return;
      }
      
      const user = JSON.parse(userStr);
      const userId = user?.id;
      
      if (!userId) {
        alert("Please log in to add favorites");
        return;
      }

      const isFavorite = favorites.includes(recipeId);
      
      if (isFavorite) {
        // Remove from favorites
        const favoritesData = await getUserFavorites(userId);
        const favoriteToDelete = favoritesData.find(fav => fav.recipeId === recipeId);
        
        if (favoriteToDelete) {
          await deleteFavorite(favoriteToDelete.favoriteId);
          setFavorites(prev => prev.filter(id => id !== recipeId));
          // Dispatch event to notify other components
          window.dispatchEvent(new Event('favoritesChanged'));
        }
      } else {
        // Add to favorites
        await addFavorite({ userId, recipeId });
        setFavorites(prev => [...prev, recipeId]);
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('favoritesChanged'));
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert("Failed to update favorite. Please try again.");
    }
  }

  return (
    <div className="App">
      <NavBar />
      <HeroBanner />
      <main className="container">
        {backendError && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px',
            color: '#c33'
          }}>
            {backendError}
          </div>
        )}
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar cuisines={cuisines} selected={cuisineFilter} onSelect={setCuisineFilter} />
        <PriceFilter onFilter={setPriceFilter} />
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Recipes</h2>
            <button className="btn-primary create-recipe-btn" onClick={() => navigate("/create-recipe")}>+ Add Recipe</button>
          </div>
          <RecipeGrid dishes={filteredDishes} onOpen={setSelected} favorites={favorites} toggleFav={toggleFav} />
        </section>
      </main>
      <RecipeDetailModal dish={selected} onClose={() => setSelected(null)} isFav={(id) => favorites.includes(id)} toggleFav={toggleFav} />
    </div>
  );
}

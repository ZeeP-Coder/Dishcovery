import React from "react";
import RecipeCard from "./RecipeCard";

export default function RecipeGrid({ dishes, onOpen, favorites, toggleFav }) {
  return (
    <div className="grid">
      {dishes.map((d) => (
        <RecipeCard key={d.id} dish={d} onOpen={() => onOpen(d)} isFav={favorites.includes(d.id)} toggleFav={toggleFav} />
      ))}
      {dishes.length === 0 && <div style={{gridColumn:"1/-1", color:"var(--text-secondary)", padding:"20px", background:"var(--card-bg)", borderRadius:8}}>No recipes found.</div>}
    </div>
  );
}

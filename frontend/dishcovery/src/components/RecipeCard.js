import React from "react";

export default function RecipeCard({ dish, onOpen, isFav, toggleFav }) {
  return (
    <article className="card" style={{position: "relative", paddingBottom: "60px"}}>
      <img src={dish.image} alt={dish.name} />
      <div className="card-body">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"start", gap:8}}>
          <h3>{dish.name}</h3>
          <button className="fav-btn" onClick={() => toggleFav(dish.id)} aria-label="Toggle favorite">{isFav ? "♥" : "♡"}</button>
        </div>
        {dish.description && !dish.description.startsWith('http') && <p>{dish.description}</p>}
        <div className="meta">
          <div>
            {dish.cuisine}
            {dish.cookTimeMinutes > 0 && ` • ${dish.cookTimeMinutes}m`}
            {dish.estimatedPrice !== null && ` • ₱${dish.estimatedPrice.toFixed(2)}`}
          </div>
          <div>{Array.from({length: Math.round(dish.rating || 0)}).map((_,i)=>(<span key={i}>★</span>))}</div>
        </div>
        <button 
          onClick={onOpen} 
          style={{
            position: "absolute",
            bottom: "14px",
            right: "14px",
            padding: "8px 20px",
            borderRadius: 8,
            border: "none",
            background: "#FF7F50",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "0.95rem"
          }}
        >
          View
        </button>
      </div>
    </article>
  );
}

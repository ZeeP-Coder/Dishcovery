import React from "react";

export default function RecipeCard({ dish, onOpen, isFav, toggleFav }) {
  return (
    <article className="card">
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
          </div>
          <div>{Array.from({length: Math.round(dish.rating || 0)}).map((_,i)=>(<span key={i}>★</span>))}</div>
        </div>
        <div style={{marginTop:10, display:"flex", justifyContent:"flex-end"}}>
          <button onClick={onOpen} style={{padding:"8px 12px", borderRadius:8, border:"none", background:"#FF7F50", color:"#fff", cursor:"pointer"}}>View</button>
        </div>
      </div>
    </article>
  );
}

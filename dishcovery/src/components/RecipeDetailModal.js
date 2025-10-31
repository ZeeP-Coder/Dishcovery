import React from "react";

export default function RecipeDetailModal({ dish, onClose, isFav, toggleFav }) {
  if (!dish) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{dish.name}</h2>
            <div style={{color:"#777", fontSize:".95rem"}}>{dish.cuisine} • {dish.cookTimeMinutes}m • {dish.difficulty}</div>
          </div>
          <div>
            <button className="fav-btn" onClick={()=>toggleFav(dish.id)}>{isFav(dish.id) ? "★" : "☆"}</button>
            <button onClick={onClose} style={{marginLeft:10}}>Close</button>
          </div>
        </div>

        <div className="modal-body">
          <div>
            <img src={dish.image} alt={dish.name} style={{width:"100%", height:260, objectFit:"cover", borderRadius:8, marginBottom:12}}/>
            <h3>Steps</h3>
            {dish.steps.map((s, idx) => (
              <div key={idx} className="step">
                <strong>Step {idx+1}.</strong> {s}
              </div>
            ))}
          </div>

          <aside>
            <div className="ingredients">
              <h4>Ingredients</h4>
              <ul style={{marginTop:8}}>
                {dish.ingredients.map((ing) => (
                  <li key={ing.id}>{ing.name} {ing.quantity ? `— ${ing.quantity}` : ""}</li>
                ))}
              </ul>
            </div>

            <div style={{marginTop:12, padding:12, background:"#fff", borderRadius:8}}>
              <strong>Tags</strong>
              <div style={{marginTop:8, display:"flex", gap:8, flexWrap:"wrap"}}>
                {dish.tags.map(t => <span key={t} style={{fontSize:'.8rem', padding:'6px 8px', background:'#fff2ea', borderRadius:999}}>{t}</span>)}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

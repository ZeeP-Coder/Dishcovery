import React from "react";

export default function RecipeDetailModal({ dish, onClose, isFav, toggleFav }) {
  if (!dish) return null;

  // Add default steps if not available
  const steps = dish.steps && dish.steps.length > 0 ? dish.steps : [
    "Prepare all ingredients and clean the meat.",
    "Heat oil in a pan and sauté garlic and onions until fragrant.",
    "Add the meat and cook until lightly browned.",
    "Pour in soy sauce, vinegar, water, and bay leaves. Simmer for 30–40 minutes.",
    "Season with pepper and salt to taste. Continue cooking until sauce thickens.",
    "Serve hot with steamed rice and enjoy!"
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{dish.name}</h2>
            <div style={{ color: "#777", fontSize: ".95rem" }}>
              {dish.cuisine} • {dish.cookTimeMinutes}m • {dish.difficulty}
            </div>
          </div>
          <div>
            <button className="fav-btn" onClick={() => toggleFav(dish.id)}>
              {isFav(dish.id) ? "★" : "☆"}
            </button>
            <button onClick={onClose} style={{ marginLeft: 10 }}>Close</button>
          </div>
        </div>

        <div className="modal-body">
          <div>
            <img
              src={dish.image}
              alt={dish.name}
              style={{
                width: "100%",
                height: 260,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 12,
              }}
            />
            <h3>How to Cook</h3>
            {steps.map((s, idx) => (
              <div key={idx} className="step" style={{ marginBottom: 6 }}>
                <strong>Step {idx + 1}.</strong> {s}
              </div>
            ))}
          </div>

          <aside>
            <div className="ingredients">
              <h4>Ingredients</h4>
              <ul style={{ marginTop: 8 }}>
                {dish.ingredients && dish.ingredients.length > 0 ? (
                  dish.ingredients.map((ing, idx) => (
                    <li key={idx}>
                      {ing.name} {ing.quantity ? `— ${ing.quantity}` : ""}
                    </li>
                  ))
                ) : (
                  <li>No ingredients listed.</li>
                )}
              </ul>
            </div>

            <div
              style={{
                marginTop: 12,
                padding: 12,
                background: "#fff",
                borderRadius: 8,
              }}
            >
              <strong>Tags</strong>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {dish.tags && dish.tags.length > 0 ? (
                  dish.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: ".8rem",
                        padding: "6px 8px",
                        background: "#fff2ea",
                        borderRadius: 999,
                      }}
                    >
                      {t}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: ".8rem", color: "#999" }}>
                    No tags available
                  </span>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

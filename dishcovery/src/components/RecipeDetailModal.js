import React, { useState, useEffect } from "react";

export default function RecipeDetailModal({ dish, onClose, isFav, toggleFav }) {
  const user = JSON.parse(localStorage.getItem("dishcovery:user")) || { nickname: "Guest" };

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Load saved comments
  useEffect(() => {
    if (dish) {
      const saved = JSON.parse(localStorage.getItem(`dishcovery:comments:${dish.id}`) || "[]");
      setComments(saved);
    }
  }, [dish]);

  // Save comments
  useEffect(() => {
    if (dish) {
      localStorage.setItem(`dishcovery:comments:${dish.id}`, JSON.stringify(comments));
    }
  }, [comments, dish]);

  if (!dish) return null;

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newEntry = {
      id: Date.now(),
      user: user.nickname,
      content: newComment,
      date: new Date().toLocaleString(),
    };

    setComments((prev) => [...prev, newEntry]);
    setNewComment("");
  };

  const steps = dish.steps || [
    "Prepare ingredients and clean the meat.",
    "Sauté garlic and onions until fragrant.",
    "Add the meat and cook until lightly browned.",
    "Add soy sauce, vinegar, and bay leaves. Simmer until tender.",
    "Season and serve with rice.",
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* ===== HEADER ===== */}
        <div className="modal-header">
          <div>
            <h2>{dish.name}</h2>
            <div style={{ color: "#777", fontSize: ".95rem" }}>
              {dish.cuisine} • {dish.cookTimeMinutes || "45"}m • {dish.difficulty || "Medium"}
            </div>
          </div>
          <div>
            <button className="fav-btn" onClick={() => toggleFav(dish.id)}>
              {isFav(dish.id) ? "★" : "☆"}
            </button>
            <button onClick={onClose} style={{ marginLeft: 10 }}>
              Close
            </button>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="modal-body" style={{ paddingBottom: "100px" }}>
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

            {/* ===== COMMENTS SECTION ===== */}
            <div style={{ marginTop: "25px" }}>
              <h3 style={{ marginBottom: "10px" }}>Comments</h3>

              {comments.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        background: "#f8f9ff",
                        border: "1px solid #e3ebee",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "6px",
                        }}
                      >
                        <strong style={{ color: "#36489e" }}>{c.user}</strong>
                        <small style={{ color: "#999" }}>{c.date}</small>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.95rem", color: "#333" }}>{c.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#777" }}>No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </div>

          {/* ===== INGREDIENTS ===== */}
          <aside>
            <div className="ingredients">
              <h4>Ingredients</h4>
              <ul style={{ marginTop: 8 }}>
                {dish.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    {ing.name} {ing.quantity ? `— ${ing.quantity}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* ===== COMMENT BAR ===== */}
        <form
          onSubmit={handleAddComment}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "#ffffff",
            borderTop: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 20px",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
              background: "#f9f9f9",
              transition: "0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#36489e")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
          <button
            type="submit"
            style={{
              background: "#36489e",
              color: "white",
              border: "none",
              borderRadius: "20px",
              padding: "10px 18px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#2e3d8f")}
            onMouseLeave={(e) => (e.target.style.background = "#36489e")}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

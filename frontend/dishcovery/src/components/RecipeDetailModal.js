import React, { useState, useEffect } from "react";

export default function RecipeDetailModal({ dish, onClose, isFav, toggleFav }) {
  // always declare hooks at the top level
  const user = JSON.parse(localStorage.getItem("dishcovery:user")) || { id: 1, nickname: "Guest" };

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  // Load saved comments + rating
  useEffect(() => {
    if (!dish) return;

    const savedComments = JSON.parse(localStorage.getItem(`dishcovery:comments:${dish.id}`) || "[]");
    setComments(savedComments);

    const savedRatings = JSON.parse(localStorage.getItem("dishcovery:ratings") || "[]");
    const recipeRatings = savedRatings.filter(r => r.recipe_id === dish.id);

    if (recipeRatings.length > 0) {
      const avg = recipeRatings.reduce((a, b) => a + b.score, 0) / recipeRatings.length;
      setAverageRating(avg.toFixed(1));
    } else {
      setAverageRating(0);
    }

    const userRating = recipeRatings.find(r => r.user_id === user.id);
    if (userRating) {
      setRating(userRating.score);
      setHasRated(true);
    } else {
      setRating(0);
      setHasRated(false);
    }
  }, [dish, user.id]);

  // Save comments
  useEffect(() => {
    if (!dish) return;
    localStorage.setItem(`dishcovery:comments:${dish.id}`, JSON.stringify(comments));
  }, [comments, dish]);

  if (!dish) return null;

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newEntry = {
      comment_id: Date.now(),
      recipe_id: dish.id,
      user_id: user.id,
      user: user.nickname,
      content: newComment,
      date: new Date().toLocaleString(),
    };

    setComments(prev => [...prev, newEntry]);
    setNewComment("");
  };

  const handleRating = (value) => {
    if (hasRated) {
      alert("You have already rated this recipe.");
      return;
    }

    const savedRatings = JSON.parse(localStorage.getItem("dishcovery:ratings") || "[]");

    const newRating = {
      rating_id: Date.now(),
      user_id: user.id,
      recipe_id: dish.id,
      score: value,
    };

    const updatedRatings = [...savedRatings, newRating];
    localStorage.setItem("dishcovery:ratings", JSON.stringify(updatedRatings));

    const recipeRatings = updatedRatings.filter(r => r.recipe_id === dish.id);
    const avg = recipeRatings.reduce((a, b) => a + b.score, 0) / recipeRatings.length;

    setRating(value);
    setAverageRating(avg.toFixed(1));
    setHasRated(true);
  };

  const getSteps = (name) => {
    switch (name) {
      case "Adobo":
        return [
          "Marinate meat in soy sauce, vinegar, garlic, and bay leaf for 30 minutes.",
          "Sauté garlic and onion, then add marinated meat.",
          "Simmer until meat is tender and sauce thickens.",
          "Serve with steamed rice.",
        ];
      case "Spaghetti Carbonara":
        return [
          "Boil pasta until al dente and drain.",
          "Cook bacon until crispy, then mix with egg and cheese sauce.",
          "Combine with hot pasta and serve immediately.",
        ];
      default:
        return ["Prepare ingredients and cook according to recipe instructions."];
    }
  };

  const steps = getSteps(dish.name);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{dish.name}</h2>
            <div style={{ color: "#777", fontSize: ".95rem" }}>
              {dish.cuisine || "Unknown"} • {dish.cookTimeMinutes || "45"}m • {dish.difficulty || "Medium"}
            </div>

            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {[1, 2, 3, 4, 5].map(value => (
                  <span
                    key={value}
                    onMouseEnter={() => !hasRated && setHoverRating(value)}
                    onMouseLeave={() => !hasRated && setHoverRating(0)}
                    onClick={() => handleRating(value)}
                    style={{
                      cursor: hasRated ? "default" : "pointer",
                      color: value <= (hoverRating || rating) ? "#FFD700" : "#ccc",
                      fontSize: "1.5rem",
                      transition: "color 0.2s",
                    }}
                  >
                    ★
                  </span>
                ))}
                <span style={{ color: "#36489e", fontWeight: 600 }}>
                  {averageRating > 0 ? `${averageRating}/5` : "No ratings yet"}
                </span>
              </div>
              <small style={{ color: "#666" }}>
                {hasRated
                  ? `You rated this ${rating} star${rating > 1 ? "s" : ""}`
                  : "Click a star to rate this recipe"}
              </small>
            </div>
          </div>

          <div>
            <button className="fav-btn" onClick={() => toggleFav(dish.id)}>
              {isFav ? "★" : "☆"}
            </button>
            <button onClick={onClose} style={{ marginLeft: 10 }}>Close</button>
          </div>
        </div>

        <div className="modal-body" style={{ paddingBottom: "100px" }}>
          <div>
            {dish.image && (
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
            )}

            <h3>How to Cook</h3>
            {dish.isUserMade ? (
              <p>{dish.instructions}</p>
            ) : (
              steps.map((s, idx) => (
                <div key={idx} className="step" style={{ marginBottom: 6 }}>
                  <strong>Step {idx + 1}.</strong> {s}
                </div>
              ))
            )}

            <div style={{ marginTop: "25px" }}>
              <h3 style={{ marginBottom: "10px" }}>Comments</h3>
              {comments.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {comments.map(c => (
                    <div
                      key={c.comment_id}
                      style={{
                        background: "#f8f9ff",
                        border: "1px solid #e3ebee",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
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

          <aside>
            <div className="ingredients">
              <h4>Ingredients</h4>
              <ul style={{ marginTop: 8 }}>
                {(dish.ingredients || []).map((ing, idx) => (
                  <li key={idx}>
                    {typeof ing === "string" ? ing : ing.name} {ing?.quantity ? `— ${ing.quantity}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

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
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

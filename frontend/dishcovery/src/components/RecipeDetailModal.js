import React, { useState, useEffect } from "react";
import { getComments, addComment, getRatings, addRating } from "../api/backend";

export default function RecipeDetailModal({ dish, onClose, isFav, toggleFav }) {
  // Get user from session storage
  const userStr = sessionStorage.getItem("dishcovery:user");
  const user = userStr ? JSON.parse(userStr) : { id: 1, nickname: "Guest" };

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  // Load comments and ratings from backend
  useEffect(() => {
    if (!dish) return;

    // Load comments from backend
    getComments()
      .then((data) => {
        const recipeComments = (data || []).filter(c => c.recipeId === (dish.backendId || dish.id));
        setComments(recipeComments);
      })
      .catch((err) => {
        console.error("Failed to load comments:", err);
        setComments([]);
      });

    // Load ratings from backend
    getRatings()
      .then((data) => {
        const recipeRatings = (data || []).filter(r => r.recipeId === (dish.backendId || dish.id));

        if (recipeRatings.length > 0) {
          const avg = recipeRatings.reduce((a, b) => a + b.score, 0) / recipeRatings.length;
          setAverageRating(avg.toFixed(1));
        } else {
          setAverageRating(0);
        }

        const userRating = recipeRatings.find(r => r.userId === user.id);
        if (userRating) {
          setRating(userRating.score);
          setHasRated(true);
        } else {
          setRating(0);
          setHasRated(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load ratings:", err);
        setAverageRating(0);
        setRating(0);
        setHasRated(false);
      });
  }, [dish, user.id]);

  if (!dish) return null;

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newEntry = {
      recipeId: dish.backendId || dish.id,
      userId: user.id,
      content: newComment,
    };

    addComment(newEntry)
      .then((response) => {
        setComments(prev => [...prev, response]);
        setNewComment("");
      })
      .catch((err) => {
        console.error("Failed to add comment:", err);
        alert("Failed to add comment. Please check the server connection.");
      });
  };

  const handleRating = (value) => {
    if (hasRated) {
      alert("You have already rated this recipe.");
      return;
    }

    const ratingEntry = {
      userId: user.id,
      recipeId: dish.backendId || dish.id,
      score: value,
    };

    addRating(ratingEntry)
      .then(() => {
        setRating(value);
        setHasRated(true);
        // Refresh ratings from backend
        getRatings()
          .then((data) => {
            const recipeRatings = (data || []).filter(r => r.recipeId === (dish.backendId || dish.id));
            if (recipeRatings.length > 0) {
              const avg = recipeRatings.reduce((a, b) => a + b.score, 0) / recipeRatings.length;
              setAverageRating(avg.toFixed(1));
            }
          })
          .catch((err) => console.error("Failed to refresh ratings:", err));
      })
      .catch((err) => {
        console.error("Failed to add rating:", err);
        alert("Failed to save rating. Please check the server connection.");
      });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{dish.name}</h2>
            <div style={{ color: "var(--text-secondary)", fontSize: ".95rem" }}>
              {dish.cuisine || "Unknown"}
              {dish.cookTimeMinutes && ` • ${dish.cookTimeMinutes}m`}
              {dish.difficulty && ` • ${dish.difficulty}`}
              {dish.estimatedPrice !== null && ` • ₱${Math.round(dish.estimatedPrice)}`}
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
                <span style={{ color: "#ff7f50", fontWeight: 600 }}>
                  {averageRating > 0 ? `${averageRating}/5` : "No ratings yet"}
                </span>
              </div>
              <small style={{ color: "var(--text-secondary)" }}>
                {hasRated
                  ? `You rated this ${rating} star${rating > 1 ? "s" : ""}`
                  : "Click a star to rate this recipe"}
              </small>
            </div>
          </div>

          <div>
            <button className="fav-btn" onClick={() => toggleFav(dish.id)}>
              {isFav ? "♥" : "♡"}
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
            <p style={{ whiteSpace: "pre-wrap" }}>{dish.instructions || "No instructions provided."}</p>

            <div style={{ marginTop: "25px" }}>
              <h3 style={{ marginBottom: "10px" }}>Comments</h3>
              {comments.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {comments.map((c, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        boxShadow: "0 2px 6px var(--shadow)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <strong style={{ color: "#ff7f50" }}>{c.username || `User ${c.userId}`}</strong>
                        <small style={{ color: "var(--text-secondary)" }}>
                          {c.datetimeCreatedAt 
                            ? new Date(c.datetimeCreatedAt).toLocaleString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })
                            : "Just now"}
                        </small>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)" }}>{c.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "var(--text-secondary)" }}>No comments yet. Be the first to share your thoughts!</p>
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

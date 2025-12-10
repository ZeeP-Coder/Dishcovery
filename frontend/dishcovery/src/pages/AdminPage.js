import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import RecipeDetailModal from "../components/RecipeDetailModal";
import { apiGet, apiPut, apiDelete } from "../api/backend";
import "./AdminPage.css";

function AdminPage() {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [approvedRecipes, setApprovedRecipes] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [allRatings, setAllRatings] = useState([]);
  const [allFavorites, setAllFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = sessionStorage.getItem("dishcovery:user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userStr);
    if (!user.isAdmin) {
      navigate("/");
      return;
    }

    loadAllData();
  }, [navigate]);

  const loadAllData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [pending, approved, users, comments, ratings, favorites] = await Promise.all([
        apiGet("/recipe/admin/pending").catch(() => []),
        apiGet("/recipe/admin/approved").catch(() => []),
        apiGet("/user/getAll").catch(() => []),
        apiGet("/comment/getAllComments").catch(() => []),
        apiGet("/rating/getAllRatings").catch(() => []),
        apiGet("/favorite/getAllFavorites").catch(() => [])
      ]);
      setPendingRecipes(pending || []);
      setApprovedRecipes(approved || []);
      setAllUsers(users || []);
      setAllComments(comments || []);
      setAllRatings(ratings || []);
      setAllFavorites(favorites || []);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleApprove = async (recipeId) => {
    try {
      await apiPut(`/recipe/admin/approve/${recipeId}`, {});
      showSuccess("Recipe approved successfully!");
      await loadAllData();
    } catch (err) {
      console.error("Error approving recipe:", err);
      setError("Failed to approve recipe. Please try again.");
    }
  };

  const handleReject = async (recipeId) => {
    if (!window.confirm("Are you sure you want to reject this recipe?")) return;
    
    try {
      await apiDelete(`/recipe/admin/reject/${recipeId}`);
      showSuccess("Recipe rejected successfully!");
      await loadAllData();
    } catch (err) {
      console.error("Error rejecting recipe:", err);
      setError("Failed to reject recipe.");
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    
    try {
      await apiDelete(`/recipe/deleteRecipe/${recipeId}`);
      showSuccess("Recipe deleted successfully!");
      await loadAllData();
    } catch (err) {
      console.error("Error deleting recipe:", err);
      setError("Failed to delete recipe.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user and all their data?")) return;
    
    try {
      await apiDelete(`/user/delete/${userId}`);
      showSuccess("User deleted successfully!");
      await loadAllData();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    
    try {
      await apiDelete(`/comment/deleteComment/${commentId}`);
      showSuccess("Comment deleted successfully!");
      await loadAllData();
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Failed to delete comment.");
    }
  };

  // Bulk Actions
  const toggleRecipeSelection = (recipeId) => {
    setSelectedRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const selectAllRecipes = (recipes) => {
    const allIds = recipes.map(r => r.recipeId);
    setSelectedRecipes(allIds);
  };

  const clearSelection = () => {
    setSelectedRecipes([]);
    setBulkActionMode(false);
  };

  const handleBulkApprove = async () => {
    if (selectedRecipes.length === 0) return;
    if (!window.confirm(`Approve ${selectedRecipes.length} recipes?`)) return;

    try {
      await Promise.all(selectedRecipes.map(id => apiPut(`/recipe/admin/approve/${id}`, {})));
      showSuccess(`${selectedRecipes.length} recipes approved!`);
      clearSelection();
      await loadAllData();
    } catch (err) {
      setError("Failed to approve some recipes.");
    }
  };

  const handleBulkReject = async () => {
    if (selectedRecipes.length === 0) return;
    if (!window.confirm(`Reject ${selectedRecipes.length} recipes?`)) return;

    try {
      await Promise.all(selectedRecipes.map(id => apiPut(`/recipe/admin/reject/${id}`, {})));
      showSuccess(`${selectedRecipes.length} recipes rejected!`);
      clearSelection();
      await loadAllData();
    } catch (err) {
      setError("Failed to reject some recipes.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRecipes.length === 0) return;
    if (!window.confirm(`Delete ${selectedRecipes.length} recipes permanently?`)) return;

    try {
      await Promise.all(selectedRecipes.map(id => apiDelete(`/recipe/deleteRecipe/${id}`)));
      showSuccess(`${selectedRecipes.length} recipes deleted!`);
      clearSelection();
      await loadAllData();
    } catch (err) {
      setError("Failed to delete some recipes.");
    }
  };

  const handleExportData = () => {
    const exportData = {
      recipes: [...pendingRecipes, ...approvedRecipes],
      users: allUsers,
      comments: allComments,
      ratings: allRatings,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dishcovery-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess("Data exported successfully!");
  };

  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    const action = newRole === 'ADMIN' ? 'promote to admin' : 'demote to user';
    
    if (!window.confirm(`${action}?`)) return;

    try {
      const user = allUsers.find(u => u.userId === userId);
      await apiPut(`/user/update/${userId}`, { ...user, role: newRole });
      showSuccess(`User ${action}d successfully!`);
      await loadAllData();
    } catch (err) {
      setError(`Failed to ${action}.`);
    }
  };

  // Dashboard Component
  const DashboardView = () => {
    const totalRecipes = pendingRecipes.length + approvedRecipes.length;
    const totalUsers = allUsers.length;
    const totalComments = allComments.length;
    const totalRatings = allRatings.length;
    const avgRating = totalRatings > 0 
      ? (allRatings.reduce((sum, r) => sum + r.score, 0) / totalRatings).toFixed(1)
      : 0;
    const totalFavorites = allFavorites.length;

    // Top contributors
    const userRecipeCount = {};
    [...pendingRecipes, ...approvedRecipes].forEach(r => {
      userRecipeCount[r.userId] = (userRecipeCount[r.userId] || 0) + 1;
    });
    const topContributors = Object.entries(userRecipeCount)
      .map(([userId, count]) => ({
        user: allUsers.find(u => u.userId === parseInt(userId)),
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Most popular recipes (by favorites + ratings)
    const recipePopularity = {};
    allFavorites.forEach(f => {
      recipePopularity[f.recipeId] = (recipePopularity[f.recipeId] || 0) + 1;
    });
    allRatings.forEach(r => {
      recipePopularity[r.recipeId] = (recipePopularity[r.recipeId] || 0) + r.score / 5;
    });

    return (
      <div className="dashboard-view">
        <div className="stats-grid">
          <div className="stat-card" style={{ borderColor: '#ff7f50' }}>
            <div className="stat-icon" style={{ color: '#ff7f50' }}>📚</div>
            <div className="stat-info">
              <h3>{totalRecipes}</h3>
              <p>Total Recipes</p>
            </div>
          </div>
          
          <div className="stat-card" style={{ borderColor: '#ffa500' }}>
            <div className="stat-icon" style={{ color: '#ffa500' }}>⏳</div>
            <div className="stat-info">
              <h3>{pendingRecipes.length}</h3>
              <p>Pending Approval</p>
            </div>
          </div>
          
          <div className="stat-card" style={{ borderColor: '#4169e1' }}>
            <div className="stat-icon" style={{ color: '#4169e1' }}>👥</div>
            <div className="stat-info">
              <h3>{totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          
          <div className="stat-card" style={{ borderColor: '#32cd32' }}>
            <div className="stat-icon" style={{ color: '#32cd32' }}>💬</div>
            <div className="stat-info">
              <h3>{totalComments}</h3>
              <p>Total Comments</p>
            </div>
          </div>
          
          <div className="stat-card" style={{ borderColor: '#ffd700' }}>
            <div className="stat-icon" style={{ color: '#ffd700' }}>⭐</div>
            <div className="stat-info">
              <h3>{avgRating}</h3>
              <p>Avg Rating</p>
            </div>
          </div>
          
          <div className="stat-card" style={{ borderColor: '#ff69b4' }}>
            <div className="stat-icon" style={{ color: '#ff69b4' }}>❤️</div>
            <div className="stat-info">
              <h3>{totalFavorites}</h3>
              <p>Total Favorites</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="analytics-section">
            <h2>📊 Top Contributors</h2>
            <div className="contributors-list">
              {topContributors.map((contributor, idx) => (
                <div key={idx} className="contributor-item">
                  <div className="contributor-rank">#{idx + 1}</div>
                  <div className="contributor-info">
                    <strong>{contributor.user?.username || 'Unknown'}</strong>
                    <span>{contributor.count} recipes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-actions">
            <h2>⚡ Quick Actions</h2>
            <button className="action-btn" onClick={() => navigate('/create-recipe')}>
              <span>➕</span>
              Create Recipe
            </button>
            <button className="action-btn" onClick={() => setActiveTab("pending")}>
              <span>⏳</span>
              Review Pending ({pendingRecipes.length})
            </button>
            <button className="action-btn" onClick={() => setActiveTab("users")}>
              <span>👥</span>
              Manage Users ({totalUsers})
            </button>
            <button className="action-btn" onClick={() => setActiveTab("comments")}>
              <span>💬</span>
              Moderate Comments ({totalComments})
            </button>
            <button className="action-btn" onClick={handleExportData}>
              <span>💾</span>
              Export Data
            </button>
            <button className="action-btn" onClick={() => setActiveTab("analytics")}>
              <span>📈</span>
              View Analytics
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Users Management View
  const UsersView = () => {
    const filteredUsers = allUsers.filter(user => 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="users-view">
        <div className="view-header">
          <h2>👥 User Management</h2>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="users-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Recipes</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => {
                const userRecipes = [...pendingRecipes, ...approvedRecipes].filter(
                  r => r.userId === user.userId
                ).length;
                const userComments = allComments.filter(c => c.userId === user.userId).length;
                
                return (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>{userRecipes}</td>
                    <td>{userComments}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn-delete-small"
                          style={{ 
                            background: user.role === 'ADMIN' ? '#ff9800' : '#4caf50',
                            marginBottom: '0.25rem'
                          }}
                          onClick={() => handleToggleUserRole(user.userId, user.role || (user.isAdmin ? 'ADMIN' : 'USER'))}
                        >
                          {user.role === 'ADMIN' || user.isAdmin ? '👤 Demote' : '👑 Promote'}
                        </button>
                        {!user.isAdmin && (
                          <button
                            className="btn-delete-small"
                            onClick={() => handleDeleteUser(user.userId)}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Comments Moderation View
  const CommentsView = () => {
    const filteredComments = allComments.filter(comment =>
      comment.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="comments-view">
        <div className="view-header">
          <h2>💬 Comment Moderation</h2>
          <input
            type="text"
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="comments-list">
          {filteredComments.map(comment => {
            const user = allUsers.find(u => u.userId === comment.userId);
            const recipe = [...pendingRecipes, ...approvedRecipes].find(
              r => r.recipeId === comment.recipeId
            );
            
            return (
              <div key={comment.commentId} className="comment-card">
                <div className="comment-header">
                  <div>
                    <strong>{user?.username || 'Unknown User'}</strong>
                    <span className="comment-meta">
                      on "{recipe?.title || 'Unknown Recipe'}"
                    </span>
                  </div>
                  <button
                    className="btn-delete-small"
                    onClick={() => handleDeleteComment(comment.commentId)}
                  >
                    🗑️
                  </button>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Analytics View
  const AnalyticsView = () => {
    const categoryCount = {};
    approvedRecipes.forEach(r => {
      const cat = r.category || 'Other';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    return (
      <div className="analytics-view">
        <h2>📈 Platform Analytics</h2>
        
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Recipes by Category</h3>
            <div className="category-stats">
              {Object.entries(categoryCount).map(([cat, count]) => (
                <div key={cat} className="category-bar">
                  <span className="category-name">{cat}</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${(count / approvedRecipes.length) * 100}%` }}
                    />
                  </div>
                  <span className="category-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <h3>User Engagement</h3>
            <div className="engagement-stats">
              <div className="stat-row">
                <span>Active Users:</span>
                <strong>{allUsers.filter(u => !u.isAdmin).length}</strong>
              </div>
              <div className="stat-row">
                <span>Avg Recipes per User:</span>
                <strong>{((pendingRecipes.length + approvedRecipes.length) / Math.max(allUsers.length, 1)).toFixed(1)}</strong>
              </div>
              <div className="stat-row">
                <span>Avg Comments per Recipe:</span>
                <strong>{(allComments.length / Math.max(approvedRecipes.length, 1)).toFixed(1)}</strong>
              </div>
              <div className="stat-row">
                <span>Approval Rate:</span>
                <strong>{((approvedRecipes.length / Math.max(pendingRecipes.length + approvedRecipes.length, 1)) * 100).toFixed(1)}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Recipe Card Component
  const RecipeCard = ({ recipe, isPending }) => {
    let ingredients = [];
    try {
      if (recipe.ingredients) {
        const parsed = JSON.parse(recipe.ingredients);
        ingredients = parsed.filter(ing => {
          const name = typeof ing === 'string' ? ing : ing.name;
          return name && name.trim() && name.trim() !== '-';
        });
      }
    } catch (e) {
      ingredients = [];
    }

    const isSelected = selectedRecipes.includes(recipe.recipeId);

    return (
      <div className={`admin-recipe-card ${isSelected ? 'selected' : ''}`}>
        {bulkActionMode && (
          <div className="recipe-checkbox">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleRecipeSelection(recipe.recipeId)}
            />
          </div>
        )}
        {recipe.image && (
          <img src={recipe.image} alt={recipe.title} className="recipe-image" />
        )}
        <div className="recipe-header">
          <h3>{recipe.title}</h3>
          <span className="recipe-category">{recipe.category || "Uncategorized"}</span>
        </div>
        
        <div className="recipe-info">
          <p><strong>By:</strong> User #{recipe.userId}</p>
          {recipe.description && <p><strong>Description:</strong> {recipe.description.substring(0, 100)}...</p>}
          {recipe.estimatedPrice && <p><strong>Est. Price:</strong> ₱{recipe.estimatedPrice}</p>}
        </div>

        <div className="recipe-actions">
          {isPending ? (
            <>
              <button className="btn-approve" onClick={() => handleApprove(recipe.recipeId)}>
                ✓ Approve
              </button>
              <button className="btn-reject" onClick={() => handleReject(recipe.recipeId)}>
                ✗ Reject
              </button>
            </>
          ) : (
            <>
              <button className="btn-view" onClick={() => {
                const mappedRecipe = {
                  id: recipe.recipeId,
                  backendId: recipe.recipeId,
                  name: recipe.title,
                  image: recipe.image,
                  description: recipe.description,
                  cuisine: recipe.category || "",
                  ingredients: ingredients.map(ing => typeof ing === 'string' ? ing : ing.name),
                  instructions: recipe.steps,
                  cookTimeMinutes: 45,
                  difficulty: "Medium",
                  rating: 0
                };
                setSelectedRecipe(mappedRecipe);
              }}>
                👁 View
              </button>
              <button className="btn-delete" onClick={() => handleDeleteRecipe(recipe.recipeId)}>
                🗑️ Delete
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-page">
      <NavBar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>🛡️ Admin Dashboard</h1>
          <p className="admin-subtitle">Manage your Dishcovery platform</p>
        </div>
        
        {error && <div className="error-banner" onClick={() => setError("")}>{error}</div>}
        {successMessage && <div className="success-banner">{successMessage}</div>}
        
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => { setActiveTab("dashboard"); setSearchTerm(""); clearSelection(); }}
          >
            📊 Dashboard
          </button>
          <button 
            className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => { setActiveTab("pending"); setSearchTerm(""); clearSelection(); }}
          >
            ⏳ Pending ({pendingRecipes.length})
          </button>
          <button 
            className={`tab-button ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => { setActiveTab("approved"); setSearchTerm(""); clearSelection(); }}
          >
            ✅ Approved ({approvedRecipes.length})
          </button>
          <button 
            className={`tab-button ${activeTab === "users" ? "active" : ""}`}
            onClick={() => { setActiveTab("users"); setSearchTerm(""); }}
          >
            👥 Users ({allUsers.length})
          </button>
          <button 
            className={`tab-button ${activeTab === "comments" ? "active" : ""}`}
            onClick={() => { setActiveTab("comments"); setSearchTerm(""); }}
          >
            💬 Comments ({allComments.length})
          </button>
          <button 
            className={`tab-button ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => { setActiveTab("analytics"); setSearchTerm(""); }}
          >
            📈 Analytics
          </button>
        </div>

        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && <DashboardView />}
            {activeTab === "users" && <UsersView />}
            {activeTab === "comments" && <CommentsView />}
            {activeTab === "analytics" && <AnalyticsView />}
            {(activeTab === "pending" || activeTab === "approved") && (
              <>
                <div className="bulk-actions-bar">
                  <div className="bulk-actions-left">
                    <button 
                      className={`bulk-toggle-btn ${bulkActionMode ? 'active' : ''}`}
                      onClick={() => {
                        setBulkActionMode(!bulkActionMode);
                        if (bulkActionMode) clearSelection();
                      }}
                    >
                      {bulkActionMode ? '✖️ Cancel' : '☑️ Bulk Select'}
                    </button>
                    {bulkActionMode && (
                      <>
                        <button 
                          className="bulk-select-all-btn"
                          onClick={() => selectAllRecipes(activeTab === "pending" ? pendingRecipes : approvedRecipes)}
                        >
                          Select All ({activeTab === "pending" ? pendingRecipes.length : approvedRecipes.length})
                        </button>
                        {selectedRecipes.length > 0 && (
                          <span className="selected-count">
                            {selectedRecipes.length} selected
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {bulkActionMode && selectedRecipes.length > 0 && (
                    <div className="bulk-actions-right">
                      {activeTab === "pending" && (
                        <>
                          <button className="bulk-btn approve" onClick={handleBulkApprove}>
                            ✅ Approve ({selectedRecipes.length})
                          </button>
                          <button className="bulk-btn reject" onClick={handleBulkReject}>
                            ❌ Reject ({selectedRecipes.length})
                          </button>
                        </>
                      )}
                      <button className="bulk-btn delete" onClick={handleBulkDelete}>
                        🗑️ Delete ({selectedRecipes.length})
                      </button>
                    </div>
                  )}
                </div>
                <div className="recipes-grid">
                  {activeTab === "pending" ? (
                    pendingRecipes.length === 0 ? (
                      <p className="no-recipes">✅ No pending recipes to review!</p>
                    ) : (
                      pendingRecipes.map(recipe => (
                        <RecipeCard key={recipe.recipeId} recipe={recipe} isPending={true} />
                      ))
                    )
                  ) : (
                    approvedRecipes.length === 0 ? (
                      <p className="no-recipes">No approved recipes yet.</p>
                    ) : (
                      approvedRecipes.map(recipe => (
                        <RecipeCard key={recipe.recipeId} recipe={recipe} isPending={false} />
                      ))
                    )
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {selectedRecipe && (
        <RecipeDetailModal
          dish={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          toggleFav={() => {}}
          isFav={false}
        />
      )}
    </div>
  );
}

export default AdminPage;

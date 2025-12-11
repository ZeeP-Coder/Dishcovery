import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import './AdminHomePage.css';
import { apiGet } from '../api/backend';

function AdminHomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRecipes: 0,
    pendingRecipes: 0,
    approvedRecipes: 0,
    totalUsers: 0,
    totalComments: 0,
    totalRatings: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const [recipes, users, comments, ratings, pending, approved, myRecipes] = await Promise.all([
        apiGet('/recipe/getAllRecipes'),
        apiGet('/user/getAll', true),
        apiGet('/comment/getAllComments'),
        apiGet('/rating/getAllRatings'),
        apiGet('/recipe/admin/pending', true),
        apiGet('/recipe/admin/approved', true),
        apiGet(`/recipe/getRecipesByUserId/${user.user_id}`)
      ]);

      setStats({
        totalRecipes: recipes.length,
        pendingRecipes: pending.length,
        approvedRecipes: approved.length,
        totalUsers: users.length,
        totalComments: comments.length,
        totalRatings: ratings.length,
        myRecipes: myRecipes.length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const managementCards = [
    {
      title: 'Recipe Management',
      icon: '📋',
      description: 'Review, approve, and manage all recipes',
      count: stats.pendingRecipes,
      label: 'Pending Approval',
      action: () => navigate('/admin'),
      color: '#FF6B35'
    },
    {
      title: 'User Management',
      icon: '👥',
      description: 'View and manage user accounts',
      count: stats.totalUsers,
      label: 'Total Users',
      action: () => navigate('/admin'),
      color: '#004E89'
    },
    {
      title: 'Content Moderation',
      icon: '💬',
      description: 'Monitor and moderate comments',
      count: stats.totalComments,
      label: 'Comments',
      action: () => navigate('/admin'),
      color: '#F77F00'
    },
    {
      title: 'Platform Analytics',
      icon: '📊',
      description: 'View platform statistics and insights',
      count: stats.totalRatings,
      label: 'Total Ratings',
      action: () => navigate('/admin'),
      color: '#06A77D'
    },
    {
      title: 'My Content',
      icon: '📝',
      description: 'Manage your own recipes',
      count: stats.myRecipes || 0,
      label: 'Your Recipes',
      action: () => navigate('/my-recipes'),
      color: '#8B0000'
    },
    {
      title: 'Create Recipe',
      icon: '✨',
      description: 'Add new recipes to the platform',
      count: '+',
      label: 'Quick Create',
      action: () => navigate('/create-recipe'),
      color: '#4caf50'
    }
  ];

  const quickActions = [
    {
      title: 'Create New Recipe',
      icon: '➕',
      description: 'Add a new recipe to the platform',
      action: () => navigate('/create-recipe'),
      color: '#4caf50'
    },
    {
      title: 'Review Pending Recipes',
      icon: '⏳',
      description: `${stats.pendingRecipes} recipes waiting for review`,
      action: () => navigate('/admin'),
      urgent: stats.pendingRecipes > 0
    },
    {
      title: 'Manage Users',
      icon: '⚙️',
      description: 'View and manage user accounts',
      action: () => navigate('/admin')
    },
    {
      title: 'View Analytics',
      icon: '📈',
      description: 'Platform performance and statistics',
      action: () => navigate('/admin')
    },
    {
      title: 'Moderate Comments',
      icon: '🛡️',
      description: 'Review and moderate user comments',
      action: () => navigate('/admin')
    },
    {
      title: 'My Recipes',
      icon: '📖',
      description: 'View and manage your own recipes',
      action: () => navigate('/my-recipes')
    }
  ];

  if (loading) {
    return (
      <div className="admin-home-page">
        <NavBar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-home-page">
      <NavBar />
      
      <div className="admin-home-container">
        {/* Welcome Header */}
        <div className="admin-welcome">
          <div className="welcome-content">
            <h1>🛡️ Admin Dashboard</h1>
            <p>Welcome to the Dishcovery Management System</p>
          </div>
          <div className="admin-badge">
            <span className="badge-icon">👑</span>
            <span className="badge-text">Administrator</span>
          </div>
        </div>

        {/* Platform Overview Stats */}
        <div className="platform-overview">
          <h2>Platform Overview</h2>
          <div className="overview-grid">
            <div className="overview-stat">
              <div className="stat-icon recipes">📚</div>
              <div className="stat-details">
                <h3>{stats.totalRecipes}</h3>
                <p>Total Recipes</p>
                <span className="stat-breakdown">{stats.approvedRecipes} approved</span>
              </div>
            </div>
            <div className="overview-stat">
              <div className="stat-icon users">👥</div>
              <div className="stat-details">
                <h3>{stats.totalUsers}</h3>
                <p>Registered Users</p>
                <span className="stat-breakdown">Active community</span>
              </div>
            </div>
            <div className="overview-stat">
              <div className="stat-icon pending">⏳</div>
              <div className="stat-details">
                <h3>{stats.pendingRecipes}</h3>
                <p>Pending Reviews</p>
                <span className="stat-breakdown">Needs attention</span>
              </div>
            </div>
            <div className="overview-stat">
              <div className="stat-icon engagement">⭐</div>
              <div className="stat-details">
                <h3>{stats.totalRatings}</h3>
                <p>Total Ratings</p>
                <span className="stat-breakdown">User engagement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Management Tools */}
        <div className="management-section">
          <h2>Management Tools</h2>
          <div className="management-grid">
            {managementCards.map((card, index) => (
              <div 
                key={index} 
                className="management-card"
                onClick={card.action}
                style={{ borderTopColor: card.color }}
              >
                <div className="card-icon" style={{ background: `${card.color}20` }}>
                  {card.icon}
                </div>
                <div className="card-content">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <div className="card-stat">
                    <span className="stat-number" style={{ color: card.color }}>{card.count}</span>
                    <span className="stat-label">{card.label}</span>
                  </div>
                </div>
                <button className="card-action" style={{ background: card.color }}>
                  Manage →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className={`action-card ${action.urgent ? 'urgent' : ''}`}
                onClick={action.action}
              >
                {action.urgent && <div className="urgent-badge">!</div>}
                <div className="action-icon">{action.icon}</div>
                <div className="action-info">
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>
                <div className="action-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="system-status">
          <h2>System Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-indicator active"></span>
              <span className="status-label">Platform Online</span>
            </div>
            <div className="status-item">
              <span className="status-indicator active"></span>
              <span className="status-label">Database Connected</span>
            </div>
            <div className="status-item">
              <span className="status-indicator active"></span>
              <span className="status-label">API Services Running</span>
            </div>
            <div className="status-item">
              <span className="status-indicator warning"></span>
              <span className="status-label">{stats.pendingRecipes} Pending Actions</span>
            </div>
          </div>
        </div>

        {/* Access Full Admin Panel */}
        <div className="full-admin-access">
          <button 
            className="full-admin-btn"
            onClick={() => navigate('/admin')}
          >
            <span className="btn-icon">🎛️</span>
            <span className="btn-text">Access Full Admin Panel</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;

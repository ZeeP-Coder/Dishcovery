import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from "./pages/SettingsPage";
import RecipesPage from "./pages/RecipesPage";
import FavoritesPage from "./pages/FavoritesPage";
import CategoriesPage from "./pages/CategoriesPage";
import AdminLoginPage from "./pages/AdminLoginPage";      // Corrected
import AdminRecipePage from "./pages/AdminRecipePage";    // Corrected
import "./App.css";

// Protect pages that need regular user login
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("dishcovery:user");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Protect pages that need admin login
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("dishcovery:admin");
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Regular User Pages */}
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/recipes" element={<PrivateRoute><RecipesPage /></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute><CategoriesPage /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Pages */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/recipes" element={<AdminRoute><AdminRecipePage /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

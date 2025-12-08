import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import RecipesPage from "./pages/RecipesPage";
import FavoritesPage from "./pages/FavoritesPage";
import CategoriesPage from "./pages/CategoriesPage";
import MyRecipesPage from "./pages/MyRecipesPage"; 
import CreateRecipePage from "./pages/CreateRecipePage";
import AdminPage from "./pages/AdminPage";
import "./App.css";

export const ThemeContext = createContext();

// Suppress MetaMask extension errors that aren't related to our app
window.addEventListener("error", (event) => {
  if (event.message && event.message.includes("MetaMask")) {
    event.preventDefault();
    return true;
  }
});

// Protects routes that require login
const PrivateRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("dishcovery:user");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Protects routes that require admin access
const AdminRoute = ({ children }) => {
  const userStr = sessionStorage.getItem("dishcovery:user");
  if (!userStr) return <Navigate to="/login" replace />;
  
  const user = JSON.parse(userStr);
  return user.isAdmin ? children : <Navigate to="/" replace />;
};

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dishcovery-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dishcovery-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/recipes" element={<PrivateRoute><RecipesPage /></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute><CategoriesPage /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/my-recipes" element={<PrivateRoute><MyRecipesPage /></PrivateRoute>} />
        <Route path="/create-recipe" element={<PrivateRoute><CreateRecipePage /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </ThemeContext.Provider>
  );
}

export default App;

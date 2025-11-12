import React from "react";
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
import "./App.css";


// ✅ Protects routes that require login
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("dishcovery:user");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Main Pages */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/recipes"
          element={
            <PrivateRoute>
              <RecipesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <CategoriesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />


        {/* 👤 User Recipe Management */}
        <Route
          path="/my-recipes"
          element={
            <PrivateRoute>
              <MyRecipesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-recipe"
          element={
            <PrivateRoute>
              <CreateRecipePage />
            </PrivateRoute>
          }
        />

        {/* 🔐 Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🚧 Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../App";
import "./NavBar.css";

function NavBar() {
  const [nickname, setNickname] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const userStr = sessionStorage.getItem("dishcovery:user");
    const storedUser = userStr ? JSON.parse(userStr) : null;
    setNickname(storedUser?.nickname || "Guest");
    setIsAdmin(storedUser?.isAdmin || false);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <span role="img" aria-label="logo">👨‍🍳</span>
          <span className="brand-name">Dishcovery</span>
        </div>
        <span className="welcome">Hi, {nickname}!</span>
      </div>

      <div className="navbar-right">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '☾' : '☀'}
        </button>
        {isAdmin ? (
          <>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
            <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
              Admin Dashboard
            </Link>
            <Link to="/my-recipes" className={location.pathname === "/my-recipes" ? "active" : ""}>
              My Recipes
            </Link>
            <Link to="/create-recipe" className={location.pathname === "/create-recipe" ? "active" : ""}>
              Create Recipe
            </Link>
            <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
            <Link to="/recipes" className={location.pathname === "/recipes" ? "active" : ""}>
              Recipes
            </Link>
            <Link to="/categories" className={location.pathname === "/categories" ? "active" : ""}>
              Categories
            </Link>
            <Link to="/favorites" className={location.pathname === "/favorites" ? "active" : ""}>
              Favorites
            </Link>
            <Link to="/my-recipes" className={location.pathname === "/my-recipes" ? "active" : ""}>
              My Recipes
            </Link>
            <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
              Profile
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;

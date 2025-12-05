import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const [nickname, setNickname] = useState("");
  const location = useLocation();

  useEffect(() => {
    const userStr = sessionStorage.getItem("dishcovery:user");
    const storedUser = userStr ? JSON.parse(userStr) : null;
    setNickname(storedUser?.nickname || "Guest");
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <span role="img" aria-label="logo">🍽️</span>
          <span className="brand-name">Dishcovery</span>
        </div>
        <span className="welcome">Hi, {nickname}!</span>
      </div>

      <div className="navbar-right">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/my-recipes">My Recipes</Link>
      </div>
    </nav>
  );
}

export default NavBar;

import React from "react";

export default function NavBar() {
  return (
    <header className="header">
      <nav className="nav container">
        <div className="brand">Dishcovery <span style={{fontSize:".9rem"}}>🍽️</span></div>
        <div className="nav-links">
          <a href="#recipes">Home</a>
          <a href="#recipes">Recipes</a>
          <a href="#categories">Categories</a>
          <a href="#favorites">Favorites</a>
        </div>
      </nav>
    </header>
  );
}

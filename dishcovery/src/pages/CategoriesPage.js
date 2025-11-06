import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import SAMPLE_DISHES from "../data/sampleDishes";
import { useNavigate } from "react-router-dom";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unique = Array.from(new Set(SAMPLE_DISHES.map((d) => d.cuisine)));
    setCategories(unique);
  }, []);

  return (
    <div className="App">
      <NavBar />
      <main className="container">
        <h1 style={{ color: "#ff7f50", marginBottom: "25px" }}>Categories</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => navigate(`/recipes?filter=${cat}`)}
              style={{
                background: "#fff7f1",
                padding: "30px",
                borderRadius: "14px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                cursor: "pointer",
                textAlign: "center",
                fontWeight: "600",
                transition: "0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#ffe7df")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#fff7f1")
              }
            >
              {cat}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default CategoriesPage;

import React from "react";

export default function FilterBar({ cuisines = [], selected, onSelect }) {
  return (
    <div className="filter-bar" role="navigation" aria-label="Cuisine filters">
      {cuisines.map((c) => (
        <button
          key={c}
          className={`filter-chip ${selected === c ? "active" : ""}`}
          onClick={() => onSelect(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

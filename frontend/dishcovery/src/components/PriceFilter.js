import React, { useState } from "react";
import "./PriceFilter.css";

export default function PriceFilter({ onFilter }) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApply = () => {
    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;

    if (min !== null && max !== null && min > max) {
      alert("Minimum price cannot be greater than maximum price");
      return;
    }

    onFilter({ minPrice: min, maxPrice: max });
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    onFilter({ minPrice: null, maxPrice: null });
  };

  return (
    <div className="price-filter">
      <h3>Price Range</h3>
      <div className="price-filter-controls">
        <div className="price-input-group">
          <label>Min Price (₱)</label>
          <input
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="price-input-group">
          <label>Max Price (₱)</label>
          <input
            type="number"
            placeholder="No limit"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <button
          onClick={handleApply}
          className="price-filter-button apply"
        >
          Apply
        </button>

        <button
          onClick={handleReset}
          className="price-filter-button reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

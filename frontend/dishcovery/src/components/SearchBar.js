import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search" role="search" aria-label="Search recipes">
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path d="M21 21l-4.35-4.35" stroke="#888" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="11" cy="11" r="6" stroke="#888" strokeWidth="1.6" fill="none"/>
      </svg>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search dishes or ingredients..." />
    </div>
  );
}

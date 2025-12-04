// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App"; // ✅ Routes handled here
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: measures app performance
reportWebVitals();

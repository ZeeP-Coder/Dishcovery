import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const stored = JSON.parse(localStorage.getItem("dishcovery:user"));
    if (!stored) {
      alert("No account found. Please register first!");
      navigate("/register");
      return;
    }

    if (stored.email === email && stored.password === password) {
      alert(`Welcome, ${stored.nickname}!`);
      navigate("/");
    } else {
      alert("Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to Dishcovery</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <p>Don't have an account? <a href="/register">Register here</a></p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

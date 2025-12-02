import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { setCurrentUser } from "../utils/userStorage";
import { apiGet } from "../api/backend";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const users = await apiGet("/user/getAll");
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        alert("Invalid email or password, or account does not exist.");
        return;
      }

      // Map backend fields into the shape used on the frontend
      const current = {
        id: user.user_id,
        nickname: user.username,
        email: user.email,
      };

      setCurrentUser(current);
      alert(`Welcome, ${current.nickname}!`);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
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

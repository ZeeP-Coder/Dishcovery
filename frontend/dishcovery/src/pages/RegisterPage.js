import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { apiGet, apiPost } from "../api/backend";
import { setCurrentUser } from "../utils/userStorage";

function RegisterPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Check if email already exists in backend
      const users = await apiGet("/user/getAll");
      const existing = users.find((u) => u.email === email);
      if (existing) {
        setError("An account with this email already exists.");
        return;
      }

      // Backend expects: username, email, password
      const created = await apiPost("/user/add", {
        username: nickname,
        email,
        password,
      });

      // Auto-login the user by saving minimal info in localStorage
      const mapped = {
        id: created.getUserId ? created.getUserId : created.userId || created.user_id || created.id,
        nickname: created.getUsername ? created.getUsername : created.username,
        email: created.getEmail ? created.getEmail : created.email,
      };

      // Normalize fields for both plain object and JPA-returned JSON
      if (typeof mapped.id === "object") {
        // If response is a class-like object, attempt to read properties
        mapped.id = created.userId || created.user_id || created.id;
        mapped.nickname = created.username || created.getUsername?.() || nickname;
        mapped.email = created.email || created.getEmail?.() || email;
      }

      setCurrentUser({ id: mapped.id, nickname: mapped.nickname, email: mapped.email });
      alert("Registration successful — you are now logged in.");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          {error && <p className="error-message">{error}</p>}

          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
          <p>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

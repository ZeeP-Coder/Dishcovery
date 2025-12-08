import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { apiGet, apiPost } from "../api/backend";
import { ThemeContext } from "../App";

function RegisterPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return "weak";
    if (pass.length < 8) return "weak";
    if (pass.length < 12) return "medium";
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[!@#$%^&*]/.test(pass)) return "strong";
    return "medium";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!nickname.trim()) {
      newErrors.nickname = "Username is required";
    } else if (nickname.length < 3) {
      newErrors.nickname = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirm) {
      newErrors.confirm = "Please confirm your password";
    } else if (password !== confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Check if email already exists in backend
      const users = await apiGet("/user/getAll");
      const existing = users.find((u) => u.email === email);
      if (existing) {
        setServerError("An account with this email already exists.");
        setIsLoading(false);
        return;
      }

      // Backend expects: username, email, password
      const created = await apiPost("/user/add", {
        username: nickname,
        email,
        password,
      });

      // Auto-login the user by storing in sessionStorage
      const mapped = {
        id: created.getUserId ? created.getUserId : created.userId || created.user_id || created.id,
        nickname: created.getUsername ? created.getUsername : created.username,
        email: created.getEmail ? created.getEmail : created.email,
      };

      // Normalize fields for both plain object and JPA-returned JSON
      if (typeof mapped.id === "object") {
        mapped.id = created.userId || created.user_id || created.id;
        mapped.nickname = created.username || created.getUsername?.() || nickname;
        mapped.email = created.email || created.getEmail?.() || email;
      }

      const user = { id: mapped.id, nickname: mapped.nickname, email: mapped.email };
      sessionStorage.setItem("dishcovery:user", JSON.stringify(user));
      setIsLoading(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      setServerError("Registration failed. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="register-container">
      <button 
        onClick={toggleTheme} 
        className="theme-toggle-btn"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--card-bg)',
          border: '2px solid var(--border-color)',
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          cursor: 'pointer',
          fontSize: '1.3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <div className="register-box">
        <div className="register-header">
          <span className="register-logo">🍽️</span>
          <h2>Register for Dishcovery</h2>
        </div>

        {serverError && <div className="error-banner">{serverError}</div>}

        <form onSubmit={handleRegister} className="register-form" noValidate>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={errors.nickname ? "input-error" : ""}
            />
            {errors.nickname && <span className="error-text">{errors.nickname}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "input-error" : ""}
            />
            {password && (
              <div className={`password-strength strength-${passwordStrength}`}>
                Strength: <strong>{passwordStrength}</strong>
              </div>
            )}
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={errors.confirm ? "input-error" : ""}
            />
            {errors.confirm && <span className="error-text">{errors.confirm}</span>}
          </div>

          <button type="submit" className="btn-register" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

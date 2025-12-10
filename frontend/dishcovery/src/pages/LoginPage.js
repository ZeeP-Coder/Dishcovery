import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { apiGet } from "../api/backend";
import { ThemeContext } from "../App";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError("");
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const users = await apiGet("/user/getAll");
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        setServerError("Invalid email or password.");
        setIsLoading(false);
        return;
      }

      // Map backend fields into the shape used on the frontend
      const current = {
        id: user.userId,
        nickname: user.username,
        email: user.email,
        isAdmin: user.admin || false,
      };

      // Store user in sessionStorage (not localStorage)
      sessionStorage.setItem("dishcovery:user", JSON.stringify(current));
      setIsLoading(false);
      
      // Redirect to admin page if user is admin, otherwise home
      if (current.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setServerError("Connection failed. Please check your internet and try again.");
      setIsLoading(false);
    }
  };

  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="login-container">
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
        {theme === 'dark' ? '☀' : '☾'}
      </button>
      <div className="login-box">
        <div className="login-header">
          <span className="login-logo">👨‍🍳</span>
          <h2>Login to Dishcovery</h2>
        </div>
        
        {serverError && <div className="error-banner">{serverError}</div>}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              type="email"
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

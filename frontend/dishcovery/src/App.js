import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import RecipesPage from "./pages/RecipesPage";
import FavoritesPage from "./pages/FavoritesPage";
import CategoriesPage from "./pages/CategoriesPage";
import MyRecipesPage from "./pages/MyRecipesPage"; 
import CreateRecipePage from "./pages/CreateRecipePage";
import AdminPage from "./pages/AdminPage";
import AdminHomePage from "./pages/AdminHomePage";
import { apiGet } from "./api/backend";
import "./App.css";

export const ThemeContext = createContext();

// Suppress MetaMask extension errors that aren't related to our app
window.addEventListener("error", (event) => {
  if (event.message && event.message.includes("MetaMask")) {
    event.preventDefault();
    return true;
  }
});

// Aggressive console tampering protection - block and revert unauthorized changes
(function() {
  let trustedUserData = null;
  let isInitialLogin = true; // Flag to allow first login
  let isLegitimateLogin = false; // Flag to allow legitimate user switches
  
  // Store the original setItem method
  const originalSetItem = sessionStorage.setItem;
  const originalGetItem = sessionStorage.getItem;
  const originalRemoveItem = sessionStorage.removeItem;
  
  // Override removeItem to detect legitimate logouts
  sessionStorage.removeItem = function(key) {
    if (key === "dishcovery:user") {
      trustedUserData = null;
      isLegitimateLogin = true; // Next setItem is a legitimate login
      
      // Reset the flag after a short delay
      setTimeout(() => {
        isLegitimateLogin = false;
      }, 2000);
    }
    originalRemoveItem.apply(this, arguments);
  };
  
  // Override setItem to validate and block unauthorized changes
  sessionStorage.setItem = function(key, value) {
    if (key === "dishcovery:user") {
      try {
        const newUser = JSON.parse(value);
        
        // If this is the first login, legitimate login, or trusted data doesn't exist yet, allow it
        if (!trustedUserData || isInitialLogin || isLegitimateLogin) {
          trustedUserData = value;
          isInitialLogin = false;
          isLegitimateLogin = false;
          originalSetItem.apply(this, arguments);
          return;
        }
        
        // If we have trusted data, compare it
        if (trustedUserData) {
          const trusted = JSON.parse(trustedUserData);
          
          // CRITICAL: Block ANY attempt to change admin account's status to false
          if (trusted.email === "dishcoveryadmin@gmail.com" && trusted.isAdmin === true) {
            if (newUser.isAdmin !== true) {
              console.error("🚫 BLOCKED: The main admin account cannot be demoted!");
              console.warn("Admin status is permanently locked to TRUE.");
              // Force admin status back to true
              newUser.isAdmin = true;
              const correctedValue = JSON.stringify(newUser);
              trustedUserData = correctedValue;
              originalSetItem.call(this, key, correctedValue);
              return;
            }
          }
          
          // Block privilege escalation (false -> true) for non-admins
          if (trusted.isAdmin === false && newUser.isAdmin === true && trusted.email === newUser.email) {
            console.error("🚫 BLOCKED: Unauthorized attempt to elevate admin privileges!");
            console.warn("Security violation detected. This action has been logged.");
            
            // Immediately restore the trusted data
            originalSetItem.call(this, key, trustedUserData);
            return; // Block the change
          }
          
          // If someone tries to change their ID for the SAME email, block it (console tampering)
          if (trusted.id !== newUser.id && trusted.email === newUser.email) {
            console.error("🚫 BLOCKED: Unauthorized attempt to change user identity!");
            originalSetItem.call(this, key, trustedUserData);
            return;
          }
        }
        
        // If it's a legitimate change, update trusted data
        trustedUserData = value;
      } catch (e) {
        console.error("Invalid session data format");
      }
    }
    
    // Allow the change to proceed
    originalSetItem.apply(this, arguments);
  };
  
  // Initialize trusted data from current session
  const currentUser = originalGetItem.call(sessionStorage, "dishcovery:user");
  if (currentUser) {
    trustedUserData = currentUser;
    isInitialLogin = false;
  }
  
  // Watch for any direct manipulation attempts (every 1 second for admin protection)
  setInterval(() => {
    const current = originalGetItem.call(sessionStorage, "dishcovery:user");
    
    // Skip check if no session or no trusted data yet, or during legitimate login
    if (!current || !trustedUserData || isInitialLogin || isLegitimateLogin) {
      return;
    }
    
    if (current !== trustedUserData) {
      try {
        const currentObj = JSON.parse(current);
        const trustedObj = JSON.parse(trustedUserData);
        
        // CRITICAL: Immediately revert admin account demotion
        if (trustedObj.email === "dishcoveryadmin@gmail.com" && trustedObj.isAdmin === true) {
          if (currentObj.isAdmin !== true && currentObj.email === trustedObj.email) {
            console.error("🚫 Admin demotion blocked! Reverting immediately...");
            originalSetItem.call(sessionStorage, "dishcovery:user", trustedUserData);
            window.location.reload();
            return;
          }
        }
        
        // Block privilege escalation or identity changes for SAME user (console tampering)
        const privilegeEscalation = trustedObj.isAdmin === false && currentObj.isAdmin === true && trustedObj.email === currentObj.email;
        const identityChange = trustedObj.id !== currentObj.id && trustedObj.email === currentObj.email;
        
        if (privilegeEscalation || identityChange) {
          console.error("🚫 Security violation detected! Reverting unauthorized changes...");
          originalSetItem.call(sessionStorage, "dishcovery:user", trustedUserData);
          
          // Force a page reload to reset any UI changes
          window.location.reload();
        } else if (currentObj.email !== trustedObj.email) {
          // Different user logged in legitimately - update trusted data
          trustedUserData = current;
        }
      } catch (e) {
        // Invalid data format
        console.error("Invalid session data detected");
      }
    }
  }, 1000); // Check every 1 second for fast admin protection
})();

// Protects routes that require login
const PrivateRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("dishcovery:user");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Home route with admin/user differentiation
const HomeRoute = () => {
  const userStr = sessionStorage.getItem("dishcovery:user");
  if (!userStr) return <Navigate to="/login" replace />;
  
  const user = JSON.parse(userStr);
  return user.isAdmin ? <AdminHomePage /> : <HomePage />;
};

// Protects routes that require admin access
const AdminRoute = ({ children }) => {
  const userStr = sessionStorage.getItem("dishcovery:user");
  if (!userStr) return <Navigate to="/login" replace />;
  
  const user = JSON.parse(userStr);
  return user.isAdmin ? children : <Navigate to="/" replace />;
};

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dishcovery-theme') || 'light';
  });

  // Verify user session on app load and continuously monitor for tampering
  useEffect(() => {
    const verifyUser = async () => {
      const userStr = sessionStorage.getItem("dishcovery:user");
      if (!userStr) return; // No user logged in, skip verification
      
      try {
        const user = JSON.parse(userStr);
        // Verify actual admin status from database
        const actualUser = await apiGet(`/user/get/${user.id}`);
        
        if (!actualUser) {
          // User doesn't exist anymore, clear session
          console.warn("User not found in database. Logging out...");
          sessionStorage.removeItem("dishcovery:user");
          window.location.href = "/login";
          return;
        }
        
        // Get admin status from backend (it returns as "admin" field)
        const actualAdminStatus = actualUser.admin === true;
        const sessionAdminStatus = user.isAdmin === true;
        
        // Only intervene if someone tried to ELEVATE privileges (false -> true)
        if (sessionAdminStatus === true && actualAdminStatus === false) {
          console.error("🚫 SECURITY ALERT: Privilege escalation blocked!");
          
          // Update session with correct status
          const updatedUser = {
            id: actualUser.userId,
            nickname: actualUser.username,
            email: actualUser.email,
            isAdmin: false
          };
          
          sessionStorage.setItem("dishcovery:user", JSON.stringify(updatedUser));
          window.location.reload();
        }
        
      } catch (error) {
        console.error("Failed to verify user session:", error);
        // Don't log out on network errors - could be temporary
      }
    };
    
    // Verify on initial load after a delay to allow login to complete
    const initialTimeout = setTimeout(verifyUser, 2000);
    
    // Set up monitoring every 5 seconds to detect console tampering
    const monitoringInterval = setInterval(verifyUser, 5000);
    
    // Clean up interval on unmount
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(monitoringInterval);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dishcovery-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <Router>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/recipes" element={<PrivateRoute><RecipesPage /></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute><CategoriesPage /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/my-recipes" element={<PrivateRoute><MyRecipesPage /></PrivateRoute>} />
        <Route path="/create-recipe" element={<PrivateRoute><CreateRecipePage /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </ThemeContext.Provider>
  );
}

export default App;

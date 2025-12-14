import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();

  const userStr = sessionStorage.getItem("dishcovery:user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = () => {
    sessionStorage.removeItem("dishcovery:user");
    navigate("/login");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    alert("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div>
      <NavBar />
      <div className="container profile-container">

        {/* Profile Section */}
        <div className="profile-center">
          <h1 className="profile-title">PROFILE</h1>

          <div className="profile-details">
            <p><strong>Nickname:</strong> {user?.nickname || "Nickname"}</p>
            <p><strong>Email:</strong> {user?.email || "Email"}</p>
          </div>
        </div>

        {/* Password Section */}
        <div className="password-section">
          <h2 className="password-title">Change Password</h2>

          <form className="password-form" onSubmit={handleChangePassword}>
            <div className="password-row">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="password-row">
              <input
                type="password"
                placeholder="New Password (min 8 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="password-row password-update-row">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn-change-password">
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* Logout Button */}
        <div className="logout-container">
          <button className="btn-logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

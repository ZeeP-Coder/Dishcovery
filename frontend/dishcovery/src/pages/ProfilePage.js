import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./ProfilePage.css";
import { getCurrentUser, setCurrentUser } from "../utils/userStorage";

function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const user = getCurrentUser();
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("dishcovery:profilePic") || ""
  );
  const [fileName, setFileName] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Placeholder if you want to fetch user recipes later
  }, [user?.email]);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("dishcovery:profilePic");
    navigate("/login");
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result);
      localStorage.setItem("dishcovery:profilePic", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePic = () => {
    setProfilePic("");
    setFileName("");
    localStorage.removeItem("dishcovery:profilePic");
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

          <div className="profile-pic-box">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="profile-pic-img" />
            ) : (
              <div className="profile-no-pic">No Profile Picture</div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          {/* Upload / Remove Button */}
          <button
            className="btn-remove-pic"
            onClick={() => {
              if (profilePic) {
                handleRemoveProfilePic();
              } else {
                fileInputRef.current.click();
              }
            }}
          >
            {profilePic ? "Remove Picture" : "Upload Picture"}
          </button>

          {/* Show file name if uploaded */}
          {fileName && <span className="file-name">{fileName}</span>}

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

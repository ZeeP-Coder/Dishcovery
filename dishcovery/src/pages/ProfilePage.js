import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../App.css"; // make sure CSS is included

function SettingsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("dishcovery:user"));
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("dishcovery:profilePic") || ""
  );

  useEffect(() => {
    // Placeholder if you want to fetch user recipes later
  }, [user?.email]);

  const handleLogout = () => {
    localStorage.removeItem("dishcovery:user");
    localStorage.removeItem("dishcovery:nickname");
    navigate("/login");
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result);
      localStorage.setItem("dishcovery:profilePic", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfilePic = () => {
    setProfilePic("");
    localStorage.removeItem("dishcovery:profilePic");
  };

  return (
    <div>
      <NavBar />
      <div className="container settings-container">

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

          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="profile-pic-input"
          />

          {profilePic && (
            <button className="btn-remove-pic" onClick={handleRemoveProfilePic}>
              Remove Picture
            </button>
          )}

          <div className="profile-details">
            <p><strong>Nickname:</strong> {user?.nickname || "Nickname"}</p>
            <p><strong>Email:</strong> {user?.email || "Email"}</p>
          </div>
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

export default SettingsPage;

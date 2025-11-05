import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function SettingsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("dishcovery:user"));

  const handleLogout = () => {
    localStorage.removeItem("dishcovery:user");
    localStorage.removeItem("dishcovery:nickname");
    navigate("/login");
  };

  return (
    <div>
      <NavBar />
      <div className="container" style={{ padding: "40px" }}>
        <h2>Profile</h2>
        <p><strong>Nickname:</strong> {user?.nickname}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <button onClick={handleLogout} style={{
          marginTop: "20px",
          background: "#ff7f50",
          color: "white",
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;

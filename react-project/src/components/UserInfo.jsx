import React, { useEffect, useState, useRef } from "react";
import PencilIcon from '../assets/sidebar_pencil.svg';

function UserInfo() {
  const [user, setUser] = useState(null);
  const fileInputRef = useRef();
  const userId = localStorage.getItem("userId") || 1;

  useEffect(() => {
    fetch(`http://localhost:5000/user/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      fetch(`http://localhost:5000/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: base64 }),
      })
        .then(res => res.json())
        .then(setUser);
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  return (
    <div style={{ textAlign: "center", padding: 18, marginTop: 18 }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <img
          src={user.profile || "https://via.placeholder.com/100"}
          alt="profile"
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #ddd",
            background: "#eee"
          }}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            background: "white",
            borderRadius: "50%",
            border: "1px solid #ddd",
            padding: 6,
            cursor: "pointer",
          }}
        >
          <img src={PencilIcon} alt="edit" width={18} height={18} />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div style={{ marginTop: 10, fontWeight: 600, fontSize: 18 }}>
        {user.loginId}'s space
      </div>
    </div>
  );
}

export default UserInfo;

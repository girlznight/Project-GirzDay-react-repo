import React, { useEffect, useState } from "react";
import UserInfo from "./UserInfo";

function Sidebar({ isOpen, onClose }) {
  const [posts, setPosts] = useState([]);
  const [textboxes, setTextboxes] = useState([]);
  const userId = localStorage.getItem("userId") || 1;

  useEffect(() => {
    if (!isOpen) return;
    fetch(`http://localhost:5000/post?userId=${userId}`)
      .then(res => res.json())
      .then(setPosts);

    fetch("http://localhost:5000/textbox")
      .then(res => res.json())
      .then(setTextboxes);
  }, [userId, isOpen]);

  const getFirstLine = (postId) => {
    const related = textboxes.find((t) => t.postId === postId);
    return related ? related.content.split("\n")[0] : "(빈 포스트)";
  };

  if (!isOpen) return null;

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 260,
        height: "100vh",
        background: "#fff",
        borderRight: "1px solid #eee",
        boxShadow: "2px 0 8px rgba(0,0,0,0.07)",
        zIndex: 999,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 닫기 버튼(모바일/테스트용) */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          background: "none",
          border: "none",
          fontSize: 28,
          color: "#aaa",
          cursor: "pointer",
        }}
        aria-label="Close sidebar"
      >×</button>
      <UserInfo />
      <button
        onClick={() => window.location.assign("/post/create")}
        style={{
          width: "90%",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: 12,
          padding: "14px 0",
          margin: "18px 0 12px 0",
          fontSize: 18,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        New post 📝
      </button>
      <div style={{ width: "90%", display: "flex", flexDirection: "column", gap: 8 }}>
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => window.location.assign(`/post/${post.id}`)}
            style={{
              background: "#f5f5f5",
              border: "none",
              borderRadius: 10,
              padding: "12px 18px",
              marginBottom: 6,
              textAlign: "left",
              fontSize: 16,
              color: "#222",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "#e8e8e8"}
            onMouseOut={e => e.currentTarget.style.background = "#f5f5f5"}
          >
            {getFirstLine(post.id)}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;

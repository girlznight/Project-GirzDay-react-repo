import React from "react";
import AlertPopup from "./AlertPopup";
import NoteBg from "../assets/sticky-note.png";  

export default function CommentPopup({ open, onClose }) {
  if (!open) return null;

  return (
    <AlertPopup onClose={onClose}>
      <div
        className="relative w-[380px] h-[380px] p-6 drop-shadow-2xl z-50"
        style={{
          backgroundImage: `url(${NoteBg})`,
          backgroundSize : "cover",
          backgroundPosition : "center",
          transform: "rotate(2deg)",
        }}
      >
        {/* 닫기(X) */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-xl leading-none select-none"
        >
          ✕
        </button>
      </div>
    </AlertPopup>
  );
}
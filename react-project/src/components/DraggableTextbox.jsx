import React, { useRef, useState } from "react";

function DraggableTextbox({ id, text, onChange, onDelete, onDrag, style }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);

  const handleDoubleClick = () => setEditing(true);

  const handleBlur = () => {
    setEditing(false);
    onChange(id, value);
  };

  // 드래그 관련
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        position: "absolute",
        border: "1px solid #ddd",
        padding: "8px",
        background: "#f9f9f9",
        ...style,
      }}
    >
      {editing ? (
        <input
          value={value}
          autoFocus
          onChange={e => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={e => {
            if (e.key === "Enter") handleBlur();
          }}
        />
      ) : (
        <span onDoubleClick={handleDoubleClick}>{value}</span>
      )}
      <button onClick={() => onDelete(id)} style={{ marginLeft: 8, color: "red" }}>
        삭제
      </button>
    </div>
  );
}

export default DraggableTextbox;

import React from "react";

function DraggableImage({ id, src, onDelete, style }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        position: "absolute",
        ...style,
      }}
    >
      <img src={src} alt="업로드 이미지" style={{ maxWidth: 200, maxHeight: 200 }} />
      <button onClick={() => onDelete(id)} style={{ marginLeft: 8, color: "red" }}>
        삭제
      </button>
    </div>
  );
}

export default DraggableImage;

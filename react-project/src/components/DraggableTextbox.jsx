import React from "react";
import { useDraggable } from "@dnd-kit/core";

function DraggableTextbox({
  id, content, x, y, onDelete, onChange,
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  
  // 위치 스타일
  const style = {
    position: "absolute",
    left: transform ? x + transform.x : x,
    top: transform ? y + transform.y : y,
    zIndex: 1,
    minWidth: 200,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      tabIndex={0}
      className="group"
    >
      {/* 드래그 핸들 */}
      <div
        {...attributes}
        {...listeners}
        style={{
          position: "absolute",
          left: 0,
          top: 5,
          width: "100%",
          height: 18,
          cursor: "grab",
          zIndex: 5,
          background: "rgba(0,0,0,0)",
        }}
        onMouseDown={e => e.stopPropagation()}
      />
      {/* 삭제 버튼 */}
      <button
        onClick={e => {
          e.stopPropagation();
          onDelete(id);
        }}
        className="absolute -top-3 -left-3 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-gray-100 z-30"
        aria-label="삭제"
        type="button"
        style={{ cursor: "pointer" }}
      >
        <span className="text-lg font-bold text-gray-500">×</span>
      </button>
      {/* 텍스트박스 */}
      <div
        className="px-4 py-2 border border-gray-300 bg-transparent"
        style={{
          fontFamily: "inherit",
          display: "inline-block",
          whiteSpace: "pre-wrap",
          width: "fit-content",
          padding: "12px 4px", 
        }}
      >
        <input
          type="text"
          value={content}
          onChange={e => onChange(id, e.target.value)}
          className="text-black text-center text-base bg-transparent outline-none"
          style={{
            display: "inline-block",
            fontFamily: "inherit",
            minWidth: 100,
            width: `${Math.max(200, content.length * 18)}px`,
            border: "none",
            background: "transparent",
          }}
        />
      </div>
    </div>
  );
}

export default DraggableTextbox;
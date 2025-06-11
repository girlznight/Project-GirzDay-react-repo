import React, { useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";

function DraggableTextbox({
  id, content, x, y, editingId, setEditingId, onChange, onDelete,
}) {
  const textareaRef = useRef(null);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const editing = editingId === id;

  // textarea 자동 높이 조절
  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [editing, content]);

  // 위치 스타일
  const style = {
    position: "absolute",
    left: transform ? x + transform.x : x,
    top: transform ? y + transform.y : y,
    zIndex: 1,
    width: 320, // 고정 width (px)
    minWidth: 320,
    maxWidth: 320,
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
      {/* 사진 프레임 스타일 텍스트박스 */}
      <div
        className={`px-8 py-6 min-h-[60px] flex items-center justify-center transition-colors duration-150
          ${editing ? "border border-gray-300 bg-transparent" : "border border-transparent bg-transparent"}
          w-full
        `}
        style={{
          fontFamily: "inherit",
        }}
        onDoubleClick={() => setEditingId(id)}
      >
        {editing ? (
          <textarea
            placeholder="Type here..."
            ref={textareaRef}
            className="w-full bg-transparent text-black outline-none resize-none overflow-hidden text-center text-lg"
            value={content}
            maxLength={500}
            onChange={e => onChange(id, e.target.value)}
            onBlur={() => setEditingId(null)}
            rows={1}
            style={{
              boxSizing: "border-box",
              border: "none",
              padding: 0,
              background: "transparent",
              fontFamily: "inherit",
              width: "100%",
              minWidth: "100%",
              maxWidth: "100%",
            }}
            autoFocus
          />
        ) : (
          <div
            className="w-full text-black text-center text-lg"
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              fontFamily: "inherit",
              width: "100%",
              minWidth: "100%",
              maxWidth: "100%",
            }}
          >
            {content}
          </div>
        )}
      </div>
    </div>
  );
}

export default DraggableTextbox;

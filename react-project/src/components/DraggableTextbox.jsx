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
    minWidth: 220,
    maxWidth: 400,
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
          top: 0,
          width: "100%",
          height: 15,
          cursor: "grab",
          zIndex: 5,
          background: "rgba(0,0,0,0.0)",
        }}
        onMouseDown={e => e.stopPropagation()}
      />
      {/* 삭제 버튼: 항상 좌상단에 노출 */}
      <button
        onClick={e => {
          e.stopPropagation();
          onDelete(id);
        }}
        className="absolute -top-4 -left-3 w-7 h-7 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow hover:bg-red-100 z-20"
        aria-label="삭제"
        type="button"
        style={{ cursor: "pointer" }}
      >
        <span className="text-lg font-bold text-gray-500">×</span>
      </button>
      {/* 사진 프레임 스타일 텍스트박스 */}
      <div
        className={`px-8 py-6 min-w-[220px] max-w-[400px] min-h-[60px] flex items-center justify-center transition-colors duration-150
          ${editing ? "border border-red-300 bg-white" : "border border-transparent bg-white"}
        `}
        style={{
          fontFamily: "inherit",
        }}
        onDoubleClick={() => setEditingId(id)}
      >
        {editing ? (
          <textarea
            ref={textareaRef}
            className="w-full bg-white text-black outline-none resize-none overflow-hidden text-center text-lg"
            value={content}
            maxLength={500}
            onChange={e => onChange(id, e.target.value)}
            onBlur={() => setEditingId(null)}
            rows={1}
            style={{
              minWidth: 180,
              maxWidth: 400,
              boxSizing: "border-box",
              border: "none",
              padding: 0,
              background: "transparent",
              fontFamily: "inherit",
            }}
            autoFocus
          />
        ) : (
          <div
            className="w-full text-black text-center text-lg"
            style={{
              minWidth: 180,
              maxWidth: 400,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              fontFamily: "inherit",
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

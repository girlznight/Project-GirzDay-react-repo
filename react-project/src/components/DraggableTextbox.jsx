import React, { useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";

function DraggableTextbox({
  id, content, x, y, editingId, setEditingId, onChange, onDelete
}) {
  const textareaRef = useRef(null);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type: "textbox" }
  });
  const editing = editingId === id;

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [editing, content]);

  const style = {
    position: "absolute",
    left: (transform ? x + transform.x : x),
    top: (transform ? y + transform.y : y),
    zIndex: 1,
    minWidth: 180,
    maxWidth: 400,
    pointerEvents: isDragging ? "none" : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} tabIndex={0} className="group">
      {/* 드래그 핸들은 항상 DOM에 존재해야 함! */}
      <div
        {...attributes}
        {...listeners}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 24,
          height: 24,
          cursor: "grab",
          zIndex: 20,
          background: "rgba(0,0,0,0.05)",
        }}
        onMouseDown={e => e.stopPropagation()}
      />
      {editing && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(id); }}
          className="absolute -top-3 -left-3 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-gray-100 z-10"
          aria-label="삭제"
          type="button"
        >
          <span className="text-lg font-bold text-gray-500">×</span>
        </button>
      )}
      {editing ? (
        <textarea
          ref={textareaRef}
          className="w-full bg-white text-black outline-none resize-none overflow-hidden px-4 py-2 rounded border border-red-300"
          value={content}
          maxLength={500}
          onChange={e => onChange(id, e.target.value)}
          onBlur={() => setEditingId(null)}
          rows={1}
          style={{
            minWidth: 180,
            maxWidth: 400,
          }}
          autoFocus
        />
      ) : (
        <div
          className="px-4 py-2 bg-transparent text-black"
          style={{
            minWidth: 180,
            maxWidth: 400,
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
          onDoubleClick={() => setEditingId(id)}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default DraggableTextbox;

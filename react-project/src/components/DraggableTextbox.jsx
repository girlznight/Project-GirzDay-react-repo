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
    minWidth: 180,
    maxWidth: 400,
  };

  return (
    <div ref={setNodeRef} style={style} tabIndex={0} className="group">
      {/* 드래그 핸들 */}
      <div
        {...attributes}
        {...listeners}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: 24,
          cursor: "grab",
          zIndex: 5,
          background: "rgba(0,0,0,0.01)",
        }}
        onMouseDown={e => e.stopPropagation()}
      />
      {/* 항상 보이는 삭제 버튼 */}
      <button
        onClick={e => {
          e.stopPropagation();
          onDelete(id);
        }}
        className="absolute top-1 right-1 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-gray-100 z-10"
        aria-label="삭제"
        type="button"
        style={{
          // 필요시 스타일 조정
        }}
      >
        <span className="text-lg font-bold text-gray-500">×</span>
      </button>
      {/* 편집/비편집 상태 전환 */}
      {editing ? (
        <textarea
          ref={textareaRef}
          className="w-full bg-white text-black outline-none resize-none overflow-hidden px-4 py-2 rounded border border-red-300"
          value={content}
          maxLength={500}
          onChange={e => onChange(id, e.target.value)}
          onBlur={() => setEditingId(null)}
          rows={1}
          style={{ minWidth: 180, maxWidth: 400, boxSizing: "border-box" }}
          autoFocus
        />
      ) : (
        <div
          className="px-4 py-2 bg-transparent text-black border border-red-300 rounded"
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

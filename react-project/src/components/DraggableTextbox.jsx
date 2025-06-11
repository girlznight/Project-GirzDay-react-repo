import React, { useRef, useEffect } from "react";
import Draggable from "react-draggable";

function DraggableTextbox({
  id,
  content,
  x,
  y,
  editingId,
  setEditingId,
  onChange,
  onDelete,
  onDragStop,
}) {
  const textareaRef = useRef(null);
  const nodeRef = useRef(null);
  const editing = editingId === id;

  // textarea 높이 자동 조절
  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [editing, content]);

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x, y }}
      onDrag={(e, data) => {
        console.log(`Textbox ${id} dragging: x=${data.x}, y=${data.y}`);
      }}
      onStop={(e, data) => {
        onDragStop(id, data.x, data.y);
        console.log(`Textbox ${id} drag stopped: x=${data.x}, y=${data.y}`);
      }}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className="relative inline-block"
        onClick={e => { e.stopPropagation(); setEditingId(id); }}
        tabIndex={0}
      >
        {editing && (
          <button
            onClick={() => onDelete(id)}
            className="absolute -top-3 -left-3 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-gray-100 z-10"
            aria-label="삭제"
            type="button"
          >
            <span className="text-lg font-bold text-gray-500">×</span>
          </button>
        )}
        {/* textarea에 직접 테두리, 패딩 적용 */}
        {editing ? (
          <textarea
            ref={textareaRef}
            className="w-full bg-white text-black outline-none resize-none overflow-hidden px-4 py-2 rounded border border-red-300"
            value={content}
            maxLength={500}
            onChange={e => onChange(id, e.target.value)}
            onBlur={() => setEditingId(null)}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            rows={1}
            style={{
              minWidth: 180,
              maxWidth: 400,
            }}
          />
        ) : (
          <div
            className="px-4 py-2 bg-white text-black rounded"
            style={{
              minWidth: 180,
              maxWidth: 400,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {content}
          </div>
        )}
      </div>
    </Draggable>
  );
}

export default DraggableTextbox;

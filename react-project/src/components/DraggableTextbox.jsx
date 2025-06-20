import React, { useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { getMaxLineLength } from "./textboxUtils";

function DraggableTextbox({
  id, content, x, y, onDelete, onChange,
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const textareaRef = useRef(null);
  
  // 가장 긴 줄의 글자 수 계산
  const charWidth = 18; // 글자당 px (폰트에 따라 조정)
  const minWidth = 200;
  const maxWidth = 500;
  const maxLineLength = getMaxLineLength(content);
  const calcWidth = Math.min(Math.max(minWidth, maxLineLength * charWidth), maxWidth);

  // 위치 스타일
  const style = {
    position: "absolute",
    left: transform ? x + transform.x : x,
    top: transform ? y + transform.y : y,
    zIndex: 1,
    minWidth: minWidth,
  };

  // content가 바뀔 때마다 textarea 높이 자동 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

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
          width: `${calcWidth}px`,
          minWidth: `${minWidth}px`,
          maxWidth: `${maxWidth}px`,
          padding: "12px 4px",
        }}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => onChange(id, e.target.value)}
          className="text-black text-center text-base bg-transparent outline-none"
          style={{
            display: "block",
            fontFamily: "inherit",
            width: "100%",
            minWidth: "100%",
            maxWidth: "100%",
            border: "none",
            background: "transparent",
            overflow: "hidden",
            resize: "none",
          }}
          rows={1}
        />
      </div>
    </div>
  );
}

export default DraggableTextbox;
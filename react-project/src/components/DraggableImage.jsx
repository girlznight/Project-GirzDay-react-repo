import React from "react";
import { useDraggable } from "@dnd-kit/core";

function DraggableImage({ id, src, x, y, onDelete, zIndex }) {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({ id });

  const style = {
    position: "absolute",
    left: transform ? x + transform.x : x,
    top: transform ? y + transform.y : y,
    zIndex: zIndex || 1, // 전달받은 zIndex 사용
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
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
      <img src={src} alt="" className="max-w-[250px] cursor-default" draggable={false} />
      {/* 드래그 핸들: 하단 바에만 listeners/attributes 부착 */}
      <div
        {...listeners}
        {...attributes}
        className="absolute left-0 top-5 w-full h-28 bg-transparent cursor-grab z-20"
        style={{
          borderRadius: "0 0 8px 8px",
          textAlign: "center",
          fontSize: "12px",
          userSelect: "none",
        }}
        title="여기를 잡고 드래그"
        onMouseDown={e => e.stopPropagation()}
      >
      </div>
    </div>
  );
}

export default DraggableImage;

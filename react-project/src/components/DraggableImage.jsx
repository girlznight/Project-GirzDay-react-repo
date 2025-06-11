import { DndContext, useDraggable } from "@dnd-kit/core";
import React, { useEffect, useRef } from "react";

function DraggableImage({ id, src, x, y, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type: "image" }
  });

  const style = {
    position: "absolute",
    left: (transform ? x + transform.x : x),
    top: (transform ? y + transform.y : y),
    zIndex: 1,
    pointerEvents: isDragging ? "none" : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <button
        onClick={e => { e.stopPropagation(); onDelete(id); }}
        className="absolute -top-3 -left-3 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-gray-100 z-10"
        aria-label="삭제"
        type="button"
      >
        <span className="text-lg font-bold text-gray-500">×</span>
      </button>
      <img src={src} alt="" className="max-w-[120px] rounded cursor-grab" draggable={false} />
    </div>
  );
}

export default DraggableImage;
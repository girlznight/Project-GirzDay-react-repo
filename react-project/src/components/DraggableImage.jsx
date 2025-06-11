import React, { useRef } from "react";
import Draggable from "react-draggable";

function DraggableImage({ id, src, x, y, z, onDelete, onDragStop }) {
  const nodeRef = useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x, y }}
      onDrag={(e, data) => {
        console.log(`Image ${id} dragging: x=${data.x}, y=${data.y}`);
      }}
      onStop={(e, data) => {
        onDragStop(id, data.x, data.y);
        console.log(`Image ${id} drag stopped: x=${data.x}, y=${data.y}`);
      }}
      bounds="parent"
    >
      <div ref={nodeRef} className="relative inline-block">
        <button
          onClick={() => onDelete(id)}
          className="absolute -top-3 -left-3 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-gray-100 z-10"
          aria-label="삭제"
          type="button"
        >
          <span className="text-lg font-bold text-gray-500">×</span>
        </button>
        <img src={src} alt="" className="max-w-[120px] rounded cursor-move" />
      </div>
    </Draggable>
  );
}

export default DraggableImage;

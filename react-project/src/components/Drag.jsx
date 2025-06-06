import React, { useState } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";

function DraggableBox({ id, position }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = {
        position: "absolute",
        left: position.x + (transform?.x ?? 0),
        top: position.y + (transform?.y ?? 0),
        cursor: "grab",
        userSelect: "none",
        border: "1px solid #c99",
        background: "blue",
        padding: 20,
        minWidth: 200,
        minHeight: 60,
        boxSizing: "border-box",
        transition: "border 0.15s",
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
        >
            <div>
                texttexttexttexttexttext<br />
                texttexttexttexttexttext
            </div>
        </div>
    );
}

function App() {
    const [position, setPosition] = useState({ x: 300, y: 80 });
    const id = "note-1";

    const handleDragEnd = event => {
        const { delta } = event;
        setPosition(pos => ({
            x: pos.x + delta.x,
            y: pos.y + delta.y,
        }));
        // db 저장 필요 시 여기에 fetch 추가
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    position: "relative",
                    background: "#fff",
                }}
            >
                <DraggableBox
                    id={id}
                    position={position}
                />
            </div>
        </DndContext>
    );
}

export default App;

import React, { useState } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";

function DraggableBox({ id, position, isSelected, onSelect }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = {
        position: "absolute",
        left: position.x + (transform?.x ?? 0),
        top: position.y + (transform?.y ?? 0),
        cursor: "grab",
        userSelect: "none",
        border: isSelected ? "1px solid #c33" : "1px solid transparent",
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
            onClick={e => {
                e.stopPropagation();
                onSelect();
            }}
        >
            <div>
                texttexttexttexttexttext<br />
                texttexttexttexttexttext<br />
                dummy text box
            </div>
        </div>
    );
}

function App() {
    const [position, setPosition] = useState({ x: 300, y: 80 });
    const [isSelected, setIsSelected] = useState(false);
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
                onClick={() => setIsSelected(false)}
            >
                <DraggableBox
                    id={id}
                    position={position}
                    isSelected={isSelected}
                    onSelect={() => setIsSelected(true)}
                />
            </div>
        </DndContext>
    );
}

export default App;

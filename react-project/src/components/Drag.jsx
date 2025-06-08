// Drag.jsx를 사용할 때 DragContext로 감싸서 사용해야함
// onDragEnd 등 이벤트 핸들러를 통해 드래그가 끝났을 때 상태 업데이트 가능
import { useDraggable } from "@dnd-kit/core";

function Drag({ id, position, children, style, ...props }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    const dragStyle = {
        position: "absolute",
        left: position.x + (transform?.x ?? 0),
        top: position.y + (transform?.y ?? 0),
        cursor: "grab",
        userSelect: "none",
        ...style, // 외부에서 주입한 스타일이 있으면 덮어씀
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={dragStyle}
            {...props}
        >
            {children}
        </div>
    );
}

export default Drag;
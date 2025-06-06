import React from 'react';

function Drag() {
    // 드래그 시작 이벤트 핸들러
    const handleDragStart = (e) => {
        // 드래그 중인 데이터 지정 (필요에 따라 수정)
        e.dataTransfer.setData("text/plain", "Drag Item");
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            style={{
                width: '120px',
                height: '40px',
                background: '#eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab',
                border: '1px solid #ccc'
            }}
        >
            Drag me!
        </div>
    );
}

export default Drag;

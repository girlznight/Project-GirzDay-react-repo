import React from "react";

function TextboxTest({ x = 100, y = 100, content = "", id }) {
  // 단순 표시용, 입력/수정 기능만 있음
  return (
    <textarea
      defaultValue={content}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 200,
        height: 80,
        resize: "both",
        background: "#f5f5f5",
        border: "1px solid #bbb",
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
        zIndex: 10,
      }}
      readOnly
    />
  );
}

export default TextboxTest;

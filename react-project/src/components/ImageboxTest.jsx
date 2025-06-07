import React from "react";

function ImageboxTest({ x = 150, y = 150, src, id }) {
  return (
    <img
      src={src}
      alt="user upload"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 120,
        height: 120,
        objectFit: "cover",
        borderRadius: 12,
        border: "1px solid #bbb",
        background: "#eee",
        zIndex: 5,
      }}
    />
  );
}

export default ImageboxTest;

function FixedImage({ x, y, z, src, onClick = () => {} }) {
  return (
    <img
      src={src}
      alt="이미지"
      onClick={onClick}
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: z,
        width: 100,
        cursor: "pointer",
      }}
    />
  );
}

export default FixedImage;
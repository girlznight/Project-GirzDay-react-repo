function FixedTextbox({
  x,
  y,
  content,
  saved,
  onChange,
  onConfirm,
  onClick = () => {},
}) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        left: x,
        top: y,
        cursor: "pointer",
      }}
    >
      {!saved ? (
        <div className="relative">
          <textarea
            className="p-2 border rounded"
            value={content}
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-sm rounded"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      ) : (
        <div className="p-2 bg-yellow-100 border rounded whitespace-pre-wrap">
          {content}
        </div>
      )}
    </div>
  );
}

export default FixedTextbox;
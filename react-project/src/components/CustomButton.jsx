function CustomButton ({ children, onClick, className = "" }) {
  return (
    // 버튼을 화면에 보여줌
    <button
      // 버튼을 클릭했을 때 실행할 함수
      onClick={onClick}
      // 버튼의 디자인 (외부에서 className으로 디자인을 바꿀 수 있음)
      className={`px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform duration-200
        ${className}`}
    >
      {/* 버튼 안에 들어갈 요소 */}
      {children}
    </button>
  );
};

export default CustomButton;

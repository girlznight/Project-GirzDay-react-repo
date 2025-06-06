import React from "react";

/**
 * 공통 버튼 컴포넌트
 * @param {React.ReactNode} children 버튼 내부 텍스트 또는 요소
 * @param {function} onClick 클릭 이벤트 핸들러
 * @param {string} className 추가 클래스명 (Tailwind)
 * @param {string} widthClass 버튼 너비 (Tailwind 클래스명으로 조정 권장)
 * @param {string} heightClass 버튼 높이 (Tailwind 클래스명으로 조정 권장)
 * @param {string} shadow 그림자 효과 (Tailwind 클래스)
 * @param {string} bgColor 배경색 및 hover 색상 (Tailwind 클래스)
 */
export const Button = ({
  children,
  onClick,
  className = "",
  widthClass = "",
  heightClass = "",
  shadow = "shadow",
  bgColor = "bg-blue-500 hover:bg-blue-600",
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${bgColor} ${shadow} ${widthClass} ${heightClass} ${className}`}
  >
    {children}
  </button>
);

import { useEffect } from "react";

export default function useOutsideClick(sidebarRef, setShowSide, setHoverId) {
  useEffect(() => { // 클릭한 요소(e.target)가 sidebar 내부에 존재하지 않으면 닫음
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSide(false);
      }
      if (!e.target.closest(".postit-wrapper")) {
        // postit-wrapper 외부 클릭 시 ... 버튼 숨기기
        setHoverId(null);
      }
    }

    // mousedown 발생할 때마다 handleClickOutside 함수가 실행되도록 eventListener 등록
    document.addEventListener("mousedown", handleClickOutside);
    // 컴포넌트가 사라질 때(unmount될 때) 실행
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarRef, setShowSide, setHoverId]);
}

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import SidebarToggleButton from "../../components/SidebarToggleButton";

function Post() {
  const { id } = useParams();
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef(null);

  // 저장된 데이터
  const [textboxes, setTextboxes] = useState([]);
  const [images, setImages] = useState([]);

  // 사이드바 이외 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
    };

    if (showSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar]);

  // 데이터 불러오기
  useEffect(() => {
    // 텍스트박스
    fetch(`http://localhost:5000/textbox?postId=${id}`)
      .then(res => res.json())
      .then(setTextboxes);

    // 이미지
    fetch(`http://localhost:5000/image?postId=${id}`)
      .then(res => res.json())
      .then(setImages);
  }, [id]);

  return (
    <div className="relative min-h-screen bg-white p-4 overflow-hidden">
      {/* 사이드바 토글 */}
      {!showSidebar && <SidebarToggleButton onClick={() => setShowSidebar(true)} />}
      {showSidebar && (
        <div ref={sidebarRef}>
          <Sidebar />
        </div>
      )}

      {/* 보드 영역 */}
      <div
        className="relative w-full h-[70vh] bg-white rounded-lg shadow"
        style={{ minHeight: 500 }}
      >
        {/* 텍스트박스 렌더링 */}
        {textboxes.map(tb => (
          <div
            key={tb.id}
            className="absolute px-4 py-2 bg-transparent text-black"
            style={{
              left: tb.x,
              top: tb.y,
              minWidth: 180,
              maxWidth: 400,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              zIndex: 1,
            }}
          >
            {tb.content}
          </div>
        ))}

        {/* 이미지 렌더링 */}
        {images.map(img => (
          <img
            key={img.id}
            src={img.src}
            alt=""
            className="absolute max-w-[120px] rounded"
            style={{
              left: img.x,
              top: img.y,
              zIndex: 1,
            }}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}

export default Post;

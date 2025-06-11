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
        className="relative w-full h-[70vh] bg-white "
        style={{ minHeight: 500 }}
      >
        {/* 텍스트박스 렌더링 */}
        {textboxes.map(tb => (
          <div
            key={tb.id}
            className="absolute px-8 py-6 flex items-center justify-center rounded"
            style={{
              left: tb.x,
              top: tb.y,
              width: 320, // PostCreate에서 썼던 고정 width
              minHeight: 60,
              zIndex: tb.zIndex || 1,
              fontFamily: "inherit",
            }}
          >
            <div
              className="w-full text-black text-center text-lg"
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                fontFamily: "inherit",
              }}
            >
              {tb.content}
            </div>
          </div>
        ))}

        {/* 이미지 렌더링 */}
        {images.map((img, idx) => (
          <div
            key={img.id}
            className="absolute"
            style={{
              left: img.x,
              top: img.y,
              width: img.width || 250,
              height: img.height || 250,
              zIndex: img.zIndex || idx + 10, // 이미지가 텍스트박스 위에 오도록 10부터 시작
              minWidth: 40,
              minHeight: 40,
            }}
          >
            <img
              src={img.src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 8,
                userSelect: "none",
                pointerEvents: "none",
              }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Post;

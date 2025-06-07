import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/SideBar";
import SidebarToggleButton from "../../components/SidebarToggleButton";

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [textboxes, setTextboxes] = useState([]);
  const [images, setImages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // <--- 추가

  useEffect(() => {
    // post 정보
    fetch(`http://localhost:5000/post/${id}`)
      .then(res => res.json())
      .then(setPost);

    // 해당 포스트의 textbox들
    fetch(`http://localhost:5000/textbox?postId=${id}`)
      .then(res => res.json())
      .then(setTextboxes);

    // 해당 포스트의 image들
    fetch(`http://localhost:5000/image?postId=${id}`)
      .then(res => res.json())
      .then(setImages);
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="relative min-h-screen bg-white">
      {/* 토글 버튼: 사이드바가 닫혀있을 때만 보이게 */}
      {!sidebarOpen && (
        <SidebarToggleButton onClick={() => setSidebarOpen(true)} />
      )}

      {/* 사이드바: 열려있을 때만 보이게 */}
      {sidebarOpen && (
        <Sidebar onClose={() => setSidebarOpen(false)} />
      )}

      {/* 오버레이: 사이드바가 열려 있을 때, 바깥 클릭 시 닫힘 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 텍스트박스 렌더 */}
      {textboxes.map(tb => (
        <div
          key={tb.id}
          className="absolute bg-yellow-50 border rounded-lg p-2"
          style={{ left: tb.x, top: tb.y, width: 200, minHeight: 40 }}
        >
          {tb.content}
        </div>
      ))}
      {/* 이미지 렌더 */}
      {images.map(img => (
        <img
          key={img.id}
          src={img.src}
          alt="post"
          className="absolute rounded-lg border"
          style={{ left: img.x, top: img.y, width: 120, height: 120, zIndex: img.z || 1 }}
        />
      ))}
    </div>
  );
}

export default Post;

import React, { useEffect, useRef, useState } from "react";
import CustomButton from "./CustomButton";
import PencilIcon from "../assets/sidebar_pencil.svg";


function Sidebar() {
  // userId는 localStorage에서 가져오고 기본값 1
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [textboxes, setTextboxes] = useState([]);
  const fileInputRef = useRef();
  

  // 유저, 포스트, 텍스트박스 데이터 fetch
  useEffect(() => {
    fetch(`http://localhost:5000/user/${userId}`)
      .then(res => res.json())
      .then(setUser);

    fetch(`http://localhost:5000/user/${userId}`)
      .then(res => res.json())
      .then(setUser);

    fetch(`http://localhost:5000/post`)
      .then(res => res.json())
      .then(setPosts);

    fetch(`http://localhost:5000/textbox`)
      .then(res => res.json())
      .then(setTextboxes);
  }, [userId]);

  // 프로필 이미지 업로드
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      fetch(`http://localhost:5000/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: base64 }),
      })
        .then(res => res.json())
        .then(setUser);
    };
    reader.readAsDataURL(file);
  };

  // 각 post의 textbox content에서 첫 줄을 제목으로 사용
  // 만약 첫 줄이 없다면 "(빈 포스트)"로 표시
  const getPostTitle = (postId) => {
    const tb = textboxes.find(t => String(t.postId) === String(postId));
    return tb ? tb.content.split("\n")[0] : "(빈 포스트)";
  };

  // 페이지 이동
  const goTo = (url) => window.location.assign(url);

  if (!user) return null;

  return (
    <aside className="fixed top-0 left-0 h-full w-[260px] bg-white border-r border-gray-100 flex flex-col items-center z-50 shadow">
      {/* 프로필 영역 */}
      <div className="mt-10 mb-4 flex flex-col items-center">
        <div className="relative">
          <img
            src={user.profile || "https://via.placeholder.com/100"}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 bg-gray-100"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute top-1 right-1 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-100 transition"
            style={{ lineHeight: 0 }}
            aria-label="Edit profile"
          >
            <img src={PencilIcon} alt="edit" className="w-5 h-5" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleProfileChange}
          />
        </div>
        <div className="mt-3 text-xl">{user.loginId}'s space</div>
      </div>
      {/* New Post 버튼 */}
      <CustomButton
        onClick={() => goTo("/post/create")}
        className="w-[90%] bg-black text-white rounded-xl py-3 mb-6 text-lg font-medium hover:bg-gray-900"
      >
        New Post <span role="img" aria-label="memo">📝</span>
      </CustomButton>
      {/* My Page 목록 */}
      <div className="w-[90%] flex flex-col gap-2">
        {posts.map(post => (
          <CustomButton
            key={post.id}
            onClick={() => goTo(`/post/${post.id}`)}
            className="w-full bg-gray-100 rounded-xl py-3 text-base text-gray-800 hover:bg-gray-200 text-left px-4 font-normal shadow-none"
          >
            {getPostTitle(post.id)}
          </CustomButton>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;

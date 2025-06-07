import React, { useEffect, useRef, useState } from "react";
import CustomButton from "./CustomButton";
import PencilIcon from "../assets/sidebar_pencil.svg";
import ProfileIcon from "../assets/sidebar_profile.svg";


function Sidebar() {
  // userId는 localStorage에서 가져오고 기본값 1
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [textboxes, setTextboxes] = useState([]);
  const fileInputRef = useRef();
  const [myPosts, setMyPosts] = useState([]);
  const [filter, setFilter] = useState("all"); // "all" or "mine"

  // 유저, 포스트, 텍스트박스 데이터 fetch
  useEffect(() => {
    fetch(`http://localhost:5000/user/${userId}`)
      .then(res => res.json())
      .then(setUser);

    fetch(`http://localhost:5000/post`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setMyPosts(data.filter(post => String(post.userId) === String(userId)));
      });

    fetch(`http://localhost:5000/textbox`)
      .then(res => res.json())
      .then(setTextboxes);
  }, [userId, posts.length, myPosts.length]);

  // 프로필 이미지 업로드
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader(); // FileReader를 사용하여 사용자의 로컬 파일을 읽음
    reader.onloadend = () => {
      const base64 = reader.result; // 파일을 base64로 인코딩 후 변수에 넣음

      // 서버에 PATCH 요청을 보내 로그인 한 유저(local storage에 저장된 userId)의 프로필 이미지 업데이트
      fetch(`http://localhost:5000/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: base64 }), // base64로 인코딩된 이미지 정보 문자열을 서버에 전송
      })
        .then(res => res.json())
        .then(setUser);
    };
    reader.readAsDataURL(file);
  };

  // 각 post의 textbox content에서 첫 줄을 제목으로 사용
  // 만약 첫 줄(텍스트 박스)이 없다면 "(빈 포스트)"로 표시
  const getPostTitle = (postId) => {
    const tb = textboxes.find(t => String(t.postId) === String(postId));
    return tb ? tb.content.split("\n")[0] : "(빈 포스트)"; //\n으로 줄바꿈된 첫 줄을 제목으로 사용
  };

  // 페이지 이동
  const goTo = (url) => window.location.assign(url); // 페이지 이동 함수
  if (!user) return null; // 유저 정보가 없으면 아무것도 렌더링하지 않음

  // 필터링된 목록
  const postList = filter === "all" ? posts : myPosts;

  return (
    <aside className="fixed top-0 left-0 h-full w-[260px] bg-white/80 border-r border-gray-100 flex flex-col items-center z-50 shadow">
       {/* 프로필 영역 */}
      <div className="mt-10 mb-4 flex flex-col items-center">
        <div className="relative">
          <img
            src={user.profile && user.profile.trim() !== "" ? user.profile : ProfileIcon}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 bg-gray-100"
            onError={e => { e.currentTarget.src = ProfileIcon; }}
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
        <div className="mt-5 mb-2 text-2xl">{user.loginId}'s space</div>
      </div>

      {/* New Post 버튼 */}
      <CustomButton
        onClick={() => goTo("/post/create")}
        className="w-[90%] bg-black text-white rounded-xl py-3 mt-2 mb-10 text-base hover:bg-gray-900"
      >
        New Post <span role="img" aria-label="memo">📝</span>
      </CustomButton>

      {/* Filter 버튼 */}
      <div className="w-[90%] flex items-center gap-2 mb-7">
        <span className="text-gray-500 text-sm ml-1 mr-2">Filter</span>
        <CustomButton
          onClick={() => setFilter("all")}
          className={`px-4 py-1 rounded-lg border ${filter === "all" ? "bg-gray-200 text-black" : "bg-white text-gray-600"} shadow-none`}
        >
          All
        </CustomButton>
        <CustomButton
          onClick={() => setFilter("mine")}
          className={`px-4 py-1 rounded-lg border ${filter === "mine" ? "bg-gray-200 text-black" : "bg-white text-gray-600"} shadow-none`}
        >
          Mine
        </CustomButton>
      </div>

      {/* Post 목록 */}
      <div className="w-[90%] flex-1 overflow-y-auto pb-6">
        {postList.map(post => (
          <div key={post.id} className="overflow-hidden rounded-xl mb-2">
            <CustomButton
              onClick={() => goTo(`/post/${post.id}`)}
              className="w-full bg-gray-100 rounded-xl py-3 text-base text-gray-800 hover:bg-gray-200 text-left px-4 font-normal shadow-none hover:scale-105 transition-transform duration-200"
            >
              {getPostTitle(post.id)}
            </CustomButton>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;

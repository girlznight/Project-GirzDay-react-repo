import React, { useEffect, useRef, useState } from "react";
import CustomButton from "./CustomButton";
import PencilIcon from "../assets/sidebar_pencil.svg";
import ProfileIcon from "../assets/sticky-note.png";

function Sidebar() {
  const userId = localStorage.getItem("userId");

  // 👇 모든 Hook은 조건문 밖에서 선언!
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [textboxes, setTextboxes] = useState([]);
  const fileInputRef = useRef();
  const [myPosts, setMyPosts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!userId) return; // userId 없으면 fetch 안 함
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
  }, [userId]);

  // 🔒 로그인 안 된 경우 UI 차단
  if (!userId) {
    return (
      <aside className="fixed top-0 left-0 h-full w-[260px] bg-white/95 border-r border-gray-100 flex flex-col items-center justify-center z-50 shadow">
        <div className="text-center">
          <div className="text-lg text-gray-700 mb-4"> Log in to unlock the magic! </div>
          <CustomButton
            onClick={() => window.location.assign("/login")}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            Continue to Login
          </CustomButton>
        </div>
      </aside>
    );
  }

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

   const getPostTitle = (postId) => {
      const postTextboxes = textboxes.filter(t => String(t.postId) === String(postId));
      if (postTextboxes.length === 0) return "Post without title!";
      // content가 있는 첫 텍스트박스를 찾기
        const nonEmpty = postTextboxes.find(tb => tb.content && tb.content.trim() !== "");
      return nonEmpty ? nonEmpty.content.split("\n")[0] : "Post without title!";
    };

  const goTo = (url) => window.location.assign(url);
  if (!user) return null;

  const postList = filter === "all" ? posts : myPosts;

  return (
    <aside className="fixed top-0 left-0 h-full w-[260px] bg-white/95 border-r border-gray-100 flex flex-col items-center z-50 shadow">
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
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import EditIcon from '../assets/sidebar_pencil.svg';

function Sidebar({ userId, isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    fetch(`http://localhost:5000/user/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('User not found');
        return res.json();
      })
      .then(setUser)
      .catch(() => setUser(null));

    fetch(`http://localhost:5000/post?userId=${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Posts not found');
        return res.json();
      })
      .then(setPosts)
      .catch(() => setPosts([]));
  }, [userId, isOpen]);

  const handleEditProfile = () => {
    fileInputRef.current.click();
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      fetch(`http://localhost:5000/user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: base64 })
      })
        .then(res => {
          if (!res.ok) throw new Error('Profile update failed');
          return res.json();
        })
        .then(() => {
          setUser(prev => ({ ...prev, profile: base64 }));
        })
        .catch(() => {
          // 에러 처리 
        });
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="sidebar"
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: "tween", duration: 0.45 }}
          className="fixed z-61 top-0 left-0 h-full w-[320px] bg-transparent border-r border-gray-100 flex flex-col items-center z-50"
        >
          {/* 닫기 버튼 */}
          <button
            className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ×
          </button>
          {/* 프로필 영역 */}
          <div className="relative w-28 h-28 mt-12 mb-4">
            <img
              src={user && user.profile ? user.profile : '/default-profile.png'}
              alt="profile"
              className="w-28 h-28 object-cover rounded-full"
            />
            <button
              className="absolute top-2 right-2 bg-white p-1 rounded-full border border-gray-200 hover:bg-gray-100 transition"
              onClick={handleEditProfile}
              aria-label="Edit profile"
            >
              <img src={EditIcon} alt="edit" className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleProfileChange}
            />
          </div>
          {/* 유저명 */}
          <div className="text-center mb-6">
            <div className="text-2xl font-medium mb-2">{user ? `${user.loginId}'s space` : "User's space"}</div>
          </div>
          {/* New Post 버튼 */}
          <button
            className="w-[90%] bg-black text-white rounded-[16px] py-3 mb-8 text-lg font-medium hover:bg-gray-900 transition"
            onClick={() => navigate("/post/create")}
          >
            New post <span role="img" aria-label="memo">📝</span>
          </button>
          {/* 페이지 리스트 */}
          <div className="w-[90%] flex flex-col gap-3">
            {posts.map(post => (
              <button
                key={post.id}
                className="w-full bg-gray-100 rounded-[12px] py-3 text-base text-gray-800 hover:bg-gray-200 transition"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                My page {post.id}
              </button>
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default Sidebar;

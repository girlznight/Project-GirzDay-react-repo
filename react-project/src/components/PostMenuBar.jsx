import { useLocation, useParams, useNavigate } from "react-router-dom";
import TextIcon from '../assets/postmenubar_text.svg';
import ImageIcon from '../assets/postmenubar_add-image.svg';
import CheckIcon from '../assets/postmenubar_check.svg';
import { useEffect, useState, useRef } from "react";

function PostMenuBar({ textboxes, setTextboxes, images, setImages, postits, setPostits }) {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);
  const fileInputRef = useRef();

  const isEdit = location.pathname.startsWith("/post/edit/");
  const isCreate = location.pathname === "/post/create";

  // edit 페이지라면 post 데이터 불러오기
  useEffect(() => {
    if (isEdit) {
      fetch(`http://localhost:3000/post/${params.id}`)
        .then(res => res.json())
        .then(data => setPostData(data));
    }
  }, [location, params.id]);

  // 이미지 base64로 추가
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        // 새 이미지 객체 생성 (좌표, z 등은 예시)
        setImages(prev => [
          ...prev,
          {
            id: Date.now(), // 임시 id
            x: 100,
            y: 100,
            z: prev.length + 1,
            postId: isEdit ? Number(params.id) : null,
            src: base64,
            userId: 1
          }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  // 텍스트박스 추가
  const handleTextButtonClick = () => {
    setTextboxes(prev => [
      ...prev,
      {
        id: Date.now(),
        x: 150,
        y: 200,
        postId: isEdit ? Number(params.id) : null,
        content: "새 텍스트박스"
      }
    ]);
  };

  // 포스트잇 추가 (예시)
  const handlePostitButtonClick = () => {
    setPostits(prev => [
      ...prev,
      {
        id: Date.now(),
        x: 100,
        y: 180,
        z: prev.length + 1,
        postId: isEdit ? Number(params.id) : null,
        content: "새 포스트잇",
        userId: 1
      }
    ]);
  };

  // 체크(완료) 버튼
  const handleCheck = async () => {
    if (isCreate) {
      // 1. post 생성
      const newPost = await fetch("http://localhost:3000/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1 })
      }).then(res => res.json());

      // 2. 텍스트박스 저장
      await Promise.all(
        textboxes.map(tb =>
          fetch("http://localhost:3000/textbox", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...tb, postId: newPost.id })
          })
        )
      );
      // 3. 포스트잇 저장
      await Promise.all(
        postits.map(pt =>
          fetch("http://localhost:3000/postit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...pt, postId: newPost.id })
          })
        )
      );
      // 4. 이미지 저장 (base64 포함)
      await Promise.all(
        images.map(img =>
          fetch("http://localhost:3000/image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...img, postId: newPost.id })
          })
        )
      );

      alert("생성 완료!");
      navigate(`/post/${newPost.id}`);
    } else if (isEdit) {
      // 1. post 수정
      await fetch(`http://localhost:3000/post/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...postData })
      });
      // 2. 텍스트박스 수정
      await Promise.all(
        textboxes.map(tb =>
          fetch(`http://localhost:3000/textbox/${tb.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tb)
          })
        )
      );
      // 3. 포스트잇 수정
      await Promise.all(
        postits.map(pt =>
          fetch(`http://localhost:3000/postit/${pt.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pt)
          })
        )
      );
      // 4. 이미지 수정 (base64 포함)
      await Promise.all(
        images.map(img =>
          fetch(`http://localhost:3000/image/${img.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(img)
          })
        )
      );

      alert("수정 완료!");
      navigate(`/post/${params.id}`);
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[50%] max-w-md h-16px bg-white shadow-lg rounded-2xl px-6 py-3 px-20 flex justify-between items-center">
      {/* 텍스트박스 아이콘 */}
      <button
        type="button"
        className="flex flex-col items-center hover:scale-110 transition duration-200"
        onClick={handleTextButtonClick}
      >
        <img src={TextIcon} alt="Text" className="w-6 h-6" />
      </button>
      {/* 포스트잇 아이콘 예시 */}
      <button
        type="button"
        className="flex flex-col items-center hover:scale-110 transition duration-200"
        onClick={handlePostitButtonClick}
      >
        <span style={{ fontSize: 24 }}>📝</span>
      </button>
      {/* 이미지 아이콘 */}
      <button
        type="button"
        className="flex flex-col items-center hover:scale-110 transition duration-200"
        onClick={handleImageButtonClick}
      >
        <img src={ImageIcon} alt="Add Image" className="w-6 h-6" />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      {/* 완료 체크 아이콘 */}
      <button onClick={handleCheck} className="flex flex-col items-center hover:scale-110 transition duration-200">
        <img src={CheckIcon} alt="Submit" className="w-6 h-6" />
      </button>
    </div>
  );
}

export default PostMenuBar;

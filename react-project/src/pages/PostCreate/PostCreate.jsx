import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscardButton from "../../components/DiscardButton";
import PostMenuBar from "../../components/PostMenuBar";
import TextboxTest from "../../components/TextboxTest";
import ImageboxTest from "../../components/ImageboxTest";
import PostBottomButton from "../../components/PostBottomButton";

function PostCreate() {
  const [textboxes, setTextboxes] = useState([]);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));

  // 텍스트박스 추가
  const handleAddTextbox = () => {
    setTextboxes(prev => [
      ...prev,
      { x: 100, y: 100, content: "", id: Date.now().toString() }
    ]);
  };

  // 이미지 추가
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImages(prev => [
        ...prev,
        { x: 150, y: 150, z: 1, src: reader.result, id: Date.now().toString() }
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  // 체크(완료) 버튼: post, textbox, image를 POST
  const handleCheck = () => {
    // 1. post 생성
    fetch("http://localhost:5000/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then(res => res.json())
      .then(postRes => {
        const postId = postRes.id;
        // 2. 텍스트박스 저장
        const textboxPromises = textboxes.map(tb =>
          fetch("http://localhost:5000/textbox", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              x: tb.x,
              y: tb.y,
              content: tb.content,
              postId,
            }),
          })
        );
        // 3. 이미지 저장
        const imagePromises = images.map(img =>
          fetch("http://localhost:5000/image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              x: img.x,
              y: img.y,
              z: img.z,
              src: img.src,
              postId,
              userId,
            }),
          })
        );
        // 4. 모두 저장 후 이동
        return Promise.all([...textboxPromises, ...imagePromises]).then(() => postId);
      })
      .then((postId) => {
        alert("생성 완료!");
        navigate(`/post/${postId}`);
      })
      .catch(() => {
        alert("에러가 발생했습니다.");
      });
  };

  // Discard 버튼 클릭 시 동작
  const handleDiscard = () => {
    if (window.confirm("정말 작성을 취소하고 나가시겠습니까?")) {
      navigate(-1);
    }
  };

  return (
    <div className="bg-white min-h-screen p-4">
      {/* 텍스트박스, 이미지 렌더링 */}
      <div className="relative w-full h-[80vh] overflow-hidden">
        {textboxes.map((tb, idx) => (
          <TextboxTest key={tb.id} {...tb} />
        ))}
        {images.map((img, idx) => (
          <ImageboxTest key={img.id} {...img} />
        ))}
      </div>
      {/* 메뉴바 (UI만 담당) */}
      <PostMenuBar
        onAddTextbox={handleAddTextbox}
        onAddImage={() => fileInputRef.current.click()}
        onCheck={handleCheck}
        fileInputRef={fileInputRef}
        onImageFileChange={handleAddImage}
      />
      {/* Discard 버튼 */}
      <DiscardButton onDiscard={handleDiscard} />
    </div>
  );
}

export default PostCreate;

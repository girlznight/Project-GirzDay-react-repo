import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscardButton from "../../components/DiscardButton";
import PostMenuBar from "../../components/PostMenuBar";
import DraggableTextbox from "../../components/DraggableTextbox";
import DraggableImage from "../../components/DraggableImage";

function PostCreate() {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));

  // 상태 관리
  const [textboxes, setTextboxes] = useState([]);
  const [images, setImages] = useState([]);
  const [dragId, setDragId] = useState(null);

  // 텍스트박스 추가
  const handleAddTextbox = () => {
    setTextboxes([
      ...textboxes,
      {
        id: Date.now(),
        text: "텍스트를 입력하세요",
        x: 100,
        y: 100 + textboxes.length * 60,
      },
    ]);
  };

  // 이미지 추가
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImages([
        ...images,
        {
          id: Date.now(),
          src: ev.target.result,
          x: 100,
          y: 100 + images.length * 120,
        },
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // 같은 파일 재업로드 대비
  };

  // 텍스트박스 수정
  const handleTextboxChange = (id, newText) => {
    setTextboxes(textboxes.map(tb => tb.id === id ? { ...tb, text: newText } : tb));
  };

  // 텍스트박스 삭제
  const handleTextboxDelete = (id) => {
    setTextboxes(textboxes.filter(tb => tb.id !== id));
  };

  // 이미지 삭제
  const handleImageDelete = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  // 드래그 앤 드롭
  const handleDrop = (e) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("text/plain"));
    const x = e.clientX - 50; // 오프셋 조정
    const y = e.clientY - 50;

    setTextboxes(textboxes.map(tb => tb.id === id ? { ...tb, x, y } : tb));
    setImages(images.map(img => img.id === id ? { ...img, x, y } : img));
    setDragId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
        // 2. 텍스트 박스 저장
        const textboxPromises = textboxes.map(tb =>
          fetch("http://localhost:5000/textbox", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, ...tb }),
          })
        );
        // 3. 이미지 저장
        const imagePromises = images.map(img =>
          fetch("http://localhost:5000/image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, ...img }),
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
    <div
      className="bg-white min-h-screen p-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ position: "relative", minHeight: "100vh" }}
    >
      {/* 메뉴바 */}
      <PostMenuBar
        onAddTextbox={handleAddTextbox}
        onAddImage={() => fileInputRef.current.click()}
        onCheck={handleCheck}
        fileInputRef={fileInputRef}
        onImageFileChange={handleAddImage}
      />
      {/* 텍스트박스 렌더 */}
      {textboxes.map(tb => (
        <DraggableTextbox
          key={tb.id}
          id={tb.id}
          text={tb.text}
          onChange={handleTextboxChange}
          onDelete={handleTextboxDelete}
          style={{ left: tb.x, top: tb.y, zIndex: 10 }}
        />
      ))}
      {/* 이미지 렌더 */}
      {images.map(img => (
        <DraggableImage
          key={img.id}
          id={img.id}
          src={img.src}
          onDelete={handleImageDelete}
          style={{ left: img.x, top: img.y, zIndex: 10 }}
        />
      ))}
      {/* 이미지 업로드 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAddImage}
      />
      {/* Discard 버튼 */}
      <DiscardButton onDiscard={handleDiscard} />
    </div>
  );
}

export default PostCreate;

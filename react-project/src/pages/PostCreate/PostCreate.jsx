import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, useDraggable } from "@dnd-kit/core";
import PostMenuBar from "../../components/PostMenuBar";
import DiscardButton from "../../components/DiscardButton";
import DraggableTextbox from "../../components/DraggableTextbox";
import DraggableImage from "../../components/DraggableImage";


function PostCreate() {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));

  const [textboxes, setTextboxes] = useState([]);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // 텍스트박스 추가
  const handleAddTextbox = () => {
    const newId = `textbox-${Date.now()}`;
    setTextboxes(prev => [
      ...prev,
      {
        id: newId,
        content: "dummy text",
        x: 400 + Math.random() * 50,
        y: 100 + prev.length * 70,
      },
    ]);
    setEditingId(newId);
  };

  // 텍스트박스 내용 변경
  const handleTextboxChange = (id, value) => {
  setTextboxes(prev =>
    prev.map(tb => tb.id === id ? { ...tb, content: value } : tb)
  );
};

  // 텍스트박스 삭제
  const handleTextboxDelete = (id) => {
    setTextboxes(prev => prev.filter(tb => tb.id !== id));
    if (editingId === id) setEditingId(null);
  };

  // 이미지 추가
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newId = `image-${Date.now()}`;
      setImages(prev => [
        ...prev,
        {
          id: newId,
          src: ev.target.result,
          x: 200 + Math.random() * 50,
          y: 300 + prev.length * 120,
        },
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // 이미지 삭제
  const handleImageDelete = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // 드래그 종료 시 위치 갱신 (dnd-kit)
  const handleDragEnd = (event) => {
    const { active, delta } = event;
    if (!active) return;
    setTextboxes(prev =>
      prev.map(tb =>
        tb.id === active.id
          ? { ...tb, x: tb.x + (delta?.x || 0), y: tb.y + (delta?.y || 0) }
          : tb
      )
    );
    setImages(prev =>
      prev.map(img =>
        img.id === active.id
          ? { ...img, x: img.x + (delta?.x || 0), y: img.y + (delta?.y || 0) }
          : img
      )
    );
  };

  // 바깥 클릭 시 편집 해제
  const handleBoardClick = () => setEditingId(null);

  // 완료(저장) - DB에 POST 후 이동
  const handleCheck = () => {
    fetch("http://localhost:5000/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then(res => res.json())
      .then(postRes => {
        const postId = postRes.id;
        // 텍스트박스 저장
        return Promise.all(
          textboxes.map(tb =>
            fetch("http://localhost:5000/textbox", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                postId,
                x: tb.x,
                y: tb.y,
                content: tb.content,
              }),
            })
          )
        ).then(() =>
          // 이미지 저장
          Promise.all(
            images.map(img =>
              fetch("http://localhost:5000/image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  postId,
                  x: img.x,
                  y: img.y,
                  src: img.src,
                  userId,
                }),
              })
            )
          )
        ).then(() => postId);
      })
      .then((postId) => {
        alert("생성 완료!");
        navigate(`/post/${postId}`);
      })
      .catch(() => {
        alert("에러가 발생했습니다.");
      });
  };

  return (
    <div className="relative min-h-screen bg-white p-4 overflow-hidden select-none">
      <h2 className="text-gray-400 text-xl mb-2">Create-post</h2>
      <DndContext onDragEnd={handleDragEnd}>
        <div
          className="relative w-full h-[70vh] bg-white rounded-lg shadow"
          style={{ minHeight: 500 }}
          onClick={handleBoardClick}
        >
          {/* 텍스트박스 */}
          {textboxes.map(tb => (
            <DraggableTextbox
              key={tb.id}
              id={tb.id}
              content={tb.content}
              x={tb.x}
              y={tb.y}
              editingId={editingId}
              setEditingId={setEditingId}
              onChange={handleTextboxChange}
              onDelete={handleTextboxDelete}
            />
          ))}
          {/* 이미지 */}
          {images.map(img => (
            <DraggableImage
              key={img.id}
              id={img.id}
              src={img.src}
              x={img.x}
              y={img.y}
              onDelete={handleImageDelete}
            />
          ))}
        </div>
      </DndContext>
      {/* 메뉴바 */}
      <PostMenuBar
        onAddTextbox={handleAddTextbox}
        onAddImage={() => fileInputRef.current.click()}
        onCheck={handleCheck}
        fileInputRef={fileInputRef}
      />
      {/* 이미지 업로드 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAddImage}
      />
      {/* Discard 버튼 */}
      <DiscardButton onDiscard={() => window.history.back()} />
    </div>
  );
}

export default PostCreate;

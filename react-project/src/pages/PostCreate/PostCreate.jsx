import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
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

  // 드래그와 더블클릭 충돌 방지 (8px 이상 이동 시에만 드래그)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

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

  // 텍스트박스 삭제 (편집 중이면 editingId도 해제)
  const handleDeleteTextbox = (id) => {
    setTextboxes(prev => prev.filter(tb => tb.id !== id));
    setEditingId(prev => (prev === id ? null : prev));
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

  // 드래그 종료 시 위치 갱신
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

  // 저장(완료) 버튼
  const handleCheck = async () => {
    try {
      // 1. post 생성
      const postRes = await fetch("http://localhost:5000/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!postRes.ok) throw new Error("게시글 생성 실패");
      const postData = await postRes.json();
      const postId = postData.id;

      // 2. 텍스트박스 저장 (순차적으로 await)
      for (const tb of textboxes) {
        if (!tb.content || tb.content.trim() === "") continue;
        const res = await fetch("http://localhost:5000/textbox", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            x: tb.x,
            y: tb.y,
            content: tb.content,
          }),
        });
        if (!res.ok) throw new Error("텍스트박스 저장 실패");
      }

      // 3. 이미지 저장 (순차적으로 await)
      for (const img of images) {
        const res = await fetch("http://localhost:5000/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            x: img.x,
            y: img.y,
            src: img.src,
            userId,
          }),
        });
        if (!res.ok) throw new Error("이미지 저장 실패");
      }

      alert("생성 완료!");
      navigate(`/post/${postId}`);
    } catch (err) {
      alert("에러가 발생했습니다: " + err.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-white p-4 overflow-hidden select-none">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div
          className="relative w-full h-[90vh] bg-white"
          style={{ minHeight: 500 }}
          onClick={handleBoardClick}
        >
          {/* 텍스트박스 목록 */}
          {textboxes.map(textbox => (
            <DraggableTextbox
              key={textbox.id}
              id={textbox.id}
              content={textbox.content}
              x={textbox.x}
              y={textbox.y}
              editingId={editingId}
              setEditingId={setEditingId}
              onChange={handleTextboxChange}
              onDelete={handleDeleteTextbox}
            />
          ))}
          {/* 이미지 목록 */}
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
      {/* 메뉴바, 이미지 업로드, Discard 버튼 */}
      <PostMenuBar
        onAddTextbox={handleAddTextbox}
        onAddImage={() => fileInputRef.current.click()}
        onCheck={handleCheck}
        fileInputRef={fileInputRef}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAddImage}
      />
      <DiscardButton onDiscard={() => window.history.back()} />
    </div>
  );
}

export default PostCreate;

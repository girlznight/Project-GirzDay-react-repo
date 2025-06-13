import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import PostMenuBar from "../../components/PostMenuBar";
import DiscardButton from "../../components/DiscardButton";
import DraggableTextbox from "../../components/DraggableTextbox";
import DraggableImage from "../../components/DraggableImage";
import AlertPopup from "../../components/AlertPopup"; 


function PostCreate() {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));

  const [textboxes, setTextboxes] = useState([]);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  // 텍스트박스 추가
  const handleAddTextbox = () => {
    const newId = Date.now(); // 숫자 id로 통일
    setTextboxes(prev => [
      ...prev,
      {
        id: newId,
        content: "",
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
      const newId = Date.now(); // 숫자 id로 통일
      setImages(prev => [
        ...prev,
        {
          id: newId,
          x: 200 + Math.random() * 50,
          y: 300 + prev.length * 120,
          z: prev.length + 1, // 쌓임 순서
          src: ev.target.result,
          userId: userId,
          // postId는 저장 시 포함
        },
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // 이미지 삭제
  const handleImageDelete = (id) => {
    setImages(prev => prev.filter(img => String(img.id) !== String(id)));
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

  const onDiscard = () => setShowAlert(true);

  const handleAlertYes = () => {
    setShowAlert(false);
    window.history.back();
  };

  const handleAlertNo = () => setShowAlert(false);

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
        // 텍스트박스 저장 (id, postId 포함)
        return Promise.all(
          textboxes.map(tb =>
            fetch("http://localhost:5000/textbox", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: tb.id,
                x: tb.x,
                y: tb.y,
                postId: postId,
                content: tb.content,
              }),
            })
          )
        ).then(() =>
          // 이미지 저장 (id, postId, z, width, height, src, userId 포함)
          Promise.all(
            images.map((img, idx) =>
              fetch("http://localhost:5000/image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: img.id,
                  x: img.x,
                  y: img.y,
                  z: img.z ?? idx + 1,
                  postId: postId,
                  src: img.src,
                  userId: img.userId,
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
    <div className="relative min-h-screen bg-[#fcfcf8] p-4 overflow-hidden select-none">
      <DndContext onDragEnd={handleDragEnd}>
        <div
          className="relative w-full h-[90vh]"
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
          {images.map((img, idx) => (
            <DraggableImage
              key={img.id}
              id={img.id}
              src={img.src}
              x={img.x}
              y={img.y}
              onDelete={handleImageDelete}
              zIndex={img.z ?? idx + 1}
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
      <DiscardButton onDiscard={onDiscard} />
      {showAlert && (
        <AlertPopup
          show={showAlert}
          message={"작성 중인 내용이 사라집니다. 정말로 나가시겠습니까?"}

          onYes={handleAlertYes}
          onNo={handleAlertNo}
        />
      )}
    </div>
  );
}

export default PostCreate;

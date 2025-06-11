import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import DraggableTextbox from "../../components/DraggableTextbox";
import DraggableImage from "../../components/DraggableImage";
import PostMenuBar from "../../components/PostMenuBar";
import DiscardButton from "../../components/DiscardButton";

function PostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const userId = Number(localStorage.getItem("userId"));
  const [textboxes, setTextboxes] = useState([]);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // 기존 데이터 불러오기
  useEffect(() => {
    const postIdStr = String(id);

    fetch(`http://localhost:5000/textbox?postId=${postIdStr}`)
      .then((res) => res.json())
      .then(setTextboxes)
      .catch((err) => console.error("텍스트박스 로드 실패", err));

    fetch(`http://localhost:5000/image?postId=${postIdStr}`)
      .then((res) => res.json())
      .then(setImages)
      .catch((err) => console.error("이미지 로드 실패", err));
  }, [id]);

  // 함수명 stripPrefix -> cutPrefix 로 변경
  const cutPrefix = (id) => (id.includes(".") ? id.split(".")[1] : id);

  // 텍스트박스 내용 변경
  const handleTextboxChange = (id, value) => {
    setTextboxes((prev) =>
      prev.map((tb) => (tb.id === id ? { ...tb, content: value } : tb))
    );
  };

  // 텍스트박스 삭제
  const handleTextboxDelete = (id) => {
    fetch(`http://localhost:5000/textbox/${cutPrefix(id)}`, {
      method: "DELETE",
    })
      .then(() => {
        setTextboxes((prev) => prev.filter((tb) => tb.id !== id));
        if (editingId === id) setEditingId(null);
      })
      .catch((err) => {
        console.error(err);
        alert("오류가 발생했습니다.");
      });
  };

  // 이미지 삭제
  const handleImageDelete = (id) => {
    fetch(`http://localhost:5000/image/${cutPrefix(id)}`, {
      method: "DELETE",
    })
      .then(() => {
        setImages((prev) => prev.filter((img) => img.id !== id));
      })
      .catch((err) => {
        console.error(err);
        alert("오류가 발생했습니다.");
      });
  };

  // 이미지 추가
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newId = `image-${Date.now()}`;
      setImages((prev) => [
        ...prev,
        {
          id: newId,
          src: ev.target.result,
          x: 200 + Math.random() * 50,
          y: 300 + prev.length * 120,
          postId: String(id),
          userId,
          isNew: true,
        },
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // 드래그 종료 시 위치 갱신 (dnd-kit)
  const handleDragEnd = (event) => {
    const { active, delta } = event;
    if (!active) return;

    setTextboxes((prev) =>
      prev.map((tb) =>
        tb.id === active.id
          ? { ...tb, x: tb.x + (delta?.x || 0), y: tb.y + (delta?.y || 0) }
          : tb
      )
    );
    setImages((prev) =>
      prev.map((img) =>
        img.id === active.id
          ? { ...img, x: img.x + (delta?.x || 0), y: img.y + (delta?.y || 0) }
          : img
      )
    );
  };

  // 바깥 클릭 시 편집 해제
  const handleBoardClick = () => setEditingId(null);

  // 새 텍스트박스 추가
  const handleAddTextbox = () => {
    const newId = `textbox-${Date.now()}`;
    setTextboxes((prev) => [
      ...prev,
      {
        id: newId,
        content: "수정 텍스트",
        x: 100 + prev.length * 30,
        y: 100 + prev.length * 30,
        postId: String(id),
      },
    ]);
    setEditingId(newId);
  };

  // 저장 
  const handleSave = async () => {
    try {
      await Promise.all(
        textboxes.map((tb) => {
          const isServerData = !tb.id.startsWith("textbox-");
          const url = isServerData
            ? `http://localhost:5000/textbox/${cutPrefix(tb.id)}`
            : `http://localhost:5000/textbox`;
          const method = isServerData ? "PATCH" : "POST";

          return fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: tb.content,
              x: tb.x,
              y: tb.y,
              postId: String(id),
            }),
          });
        })
      );

      await Promise.all(
        images.map((img) => {
          const isNew = img.isNew;
          const url = isNew
            ? `http://localhost:5000/image`
            : `http://localhost:5000/image/${cutPrefix(img.id)}`;
          const method = isNew ? "POST" : "PATCH";

          return fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              src: img.src,
              x: img.x,
              y: img.y,
              postId: String(id),
              userId,
            }),
          });
        })
      );

      alert("저장 완료!");
      navigate(`/post/${id}`);
    } catch (err) {
      console.error(err);
      alert("에러가 발생했습니다.");
    }
  };

  return (
    <div className="relative min-h-screen bg-white p-4 overflow-hidden select-none">
      <DndContext onDragEnd={handleDragEnd}>
        <div
          className="relative w-full h-[90vh] bg-white"
          style={{ minHeight: 500 }}
          onClick={handleBoardClick}
        >
          {/* 텍스트박스 */}
          {textboxes.map((tb) => (
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
          {images.map((img) => (
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
        onCheck={handleSave}
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

export default PostEdit;
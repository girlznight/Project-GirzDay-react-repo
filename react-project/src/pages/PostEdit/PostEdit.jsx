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
  const [originalTextboxes, setOriginalTextboxes] = useState([]);
  const [images, setImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);

  // 삭제한 텍스트박스/이미지 ID
  const [deletedTextboxIds, setDeletedTextboxIds] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const postIdStr = String(id);

    fetch(`http://localhost:5000/textbox?postId=${postIdStr}`)
      .then((res) => res.json())
      .then((data) => {
        setTextboxes(data);
        setOriginalTextboxes(data);
        setDeletedTextboxIds([]); 
      })
      .catch((err) => console.error("텍스트박스 로드 실패", err));

    fetch(`http://localhost:5000/image?postId=${postIdStr}`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setOriginalImages(data);
        setDeletedImageIds([]);
      })
      .catch((err) => console.error("이미지 로드 실패", err));
  }, [id]);

  const cutPrefix = (id) => (id.includes("-") ? id.split("-")[1] : id);

  // 텍스트박스 내용 변경
  const handleTextboxChange = (id, value) => {
    setTextboxes((prev) =>
      prev.map((tb) => (tb.id === id ? { ...tb, content: value } : tb))
    );
  };

  // 텍스트박스 수정 취소
  const handleTextboxCancel = (id) => {
    const original = originalTextboxes.find(
      (tb) => cutPrefix(tb.id) === cutPrefix(id)
    );
    if (!original) {
      // 새로 추가한 텍스트박스면 삭제
      setTextboxes((prev) => prev.filter((tb) => tb.id !== id));
    } else {
      // 기존 텍스트박스면 원본 내용으로 복원
      setTextboxes((prev) =>
        prev.map((tb) => (cutPrefix(tb.id) === cutPrefix(id) ? original : tb))
      );
    }
    setEditingId(null);
  };

  // 텍스트박스 삭제
  const handleTextboxDelete = (id) => {
    const isOriginal = originalTextboxes.some(
      (tb) => cutPrefix(tb.id) === cutPrefix(id)
    );

    if (isOriginal) {
      // 기존에 서버에 있던 텍스트박스 삭제 ID에 추가
      setDeletedTextboxIds((prev) => [...prev, cutPrefix(id)]);
    }
    // 화면에서 삭제 처리
    setTextboxes((prev) => prev.filter((tb) => tb.id !== id));

    if (editingId === id) setEditingId(null);
  };

  const handleImageDelete = (id) => {
    const cleanId = cutPrefix(id);
    const isOriginal = originalImages.some(
      (img) => cutPrefix(img.id) === cleanId
    );

    if (isOriginal) {
      // 서버에 존재하던 이미지면 삭제 예약
      setDeletedImageIds((prev) => [...prev, cleanId]);
    }

    // 화면에서만 제거
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

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

  const handleBoardClick = () => setEditingId(null);

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
        isNew: true,
      },
    ]);
    setEditingId(newId);
  };

  // 저장: 수정, 추가, 삭제 요청 전송
  const handleSave = async () => {
    try {
      // 텍스트박스 수정 저장
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

      // 이미지 수정 저장
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

      // 텍스트 박스 삭제
      await Promise.all(
        deletedTextboxIds.map((tbId) =>
          fetch(`http://localhost:5000/textbox/${tbId}`, { method: "DELETE" })
        )
      );

      // 이미지 삭제
      await Promise.all(
        deletedImageIds.map((imgId) =>
          fetch(`http://localhost:5000/image/${imgId}`, { method: "DELETE" })
        )
      );

      alert("저장 완료!");
      navigate(`/post/${id}`);
    } catch (err) {
      console.error(err);
      alert("에러가 발생했습니다.");
    }
  };

  const handleDiscard = () => {
    const confirm = window.confirm(
      "변경 내용이 사라집니다. 정말 나가시겠어요?"
    );
    if (!confirm) return;
    setTextboxes(originalTextboxes);
    setImages(originalImages);
    setDeletedTextboxIds([]);
    setDeletedImageIds([]);
    setEditingId(null);
    window.history.back();
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
              onCancel={handleTextboxCancel}
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
              onDelete={handleImageDelete} // 여기 함수가 정확히 전달되는지 확인
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
      <DiscardButton onDiscard={handleDiscard} />
    </div>
  );
}

export default PostEdit;

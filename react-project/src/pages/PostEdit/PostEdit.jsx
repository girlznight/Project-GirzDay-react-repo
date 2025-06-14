import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import DraggableTextbox from "../../components/DraggableTextbox";
import DraggableImage from "../../components/DraggableImage";
import PostMenuBar from "../../components/PostMenuBar";
import DiscardButton from "../../components/DiscardButton";
import AlertPopup from "../../components/AlertPopup";

function PostEdit() {
  const { id } = useParams();
  const postId = id;
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const userId = Number(localStorage.getItem("userId"));

  const [textboxes, setTextboxes] = useState([]);
  const [originalTextboxes, setOriginalTextboxes] = useState([]);
  const [images, setImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const [deletedTextboxIds, setDeletedTextboxIds] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/textbox?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setTextboxes(data);
        setOriginalTextboxes(data);
      });

    fetch(`http://localhost:5000/image?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setOriginalImages(data);
      });
  }, [postId]);

  // 텍스트박스 내용 변경
  const handleTextboxChange = (id, value) => {
    setTextboxes((prev) =>
      prev.map((tb) =>
        tb.id === id ? { ...tb, content: value } : tb
      )
    );
  };

  // 텍스트박스 수정 취소
  const handleTextboxCancel = (id) => {
    const original = originalTextboxes.find((tb) => tb.id === id);
    if (!original) {
      // 새로 추가한 텍스트박스면 삭제
      setTextboxes((prev) => prev.filter((tb) => tb.id !== id));
    } else {
      // 기존 텍스트박스면 원본 내용으로 복원
      setTextboxes((prev) =>
        prev.map((tb) => (tb.id === id ? original : tb))
      );
    }
    setEditingId(null);
  };

  // 텍스트박스 삭제
  const handleTextboxDelete = (id) => {
    const isOriginal = originalTextboxes.some((tb) => tb.id === id);

    if (isOriginal) {
      setDeletedTextboxIds((prev) => [...prev, id]);
    }
    setTextboxes((prev) => prev.filter((tb) => tb.id !== id));

    if (editingId === id) setEditingId(null);
  };

  // 이미지 삭제
  const handleImageDelete = (id) => {
    const isOriginal = originalImages.some((img) => img.id === id);

    if (isOriginal) {
      setDeletedImageIds((prev) => [...prev, id]);
    }
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // 이미지 추가
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const newId = Date.now();
      setImages((prev) => [
        ...prev,
        {
          id: newId,
          src: ev.target.result,
          x: 200 + Math.random() * 50,
          y: 300 + prev.length * 120,
          postId: postId,
          userId,
          isNew: true,
        },
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // 드래그 종료 후 위치 갱신
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

  // 텍스트박스 추가
  const handleAddTextbox = () => {
    const newId = Date.now();
    setTextboxes((prev) => [
      ...prev,
      {
        id: newId,
        content: "",
        x: 100 + prev.length * 30,
        y: 100 + prev.length * 30,
        postId: postId, 
        isNew: true,
      },
    ]);
    setEditingId(newId);
  };

  const handleSave = async () => {
    try {
      // 텍스트박스 저장/수정
      const updatedTextboxes = await Promise.all(
        textboxes.map(async (tb) => {
          if (tb.isNew) {
            const res = await fetch(`http://localhost:5000/textbox`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: tb.id,
                postId: postId,
                x: tb.x,
                y: tb.y,
                content: tb.content,
              }),
            });
            const data = await res.json(); 
            return { ...tb, id: data.id, isNew: false };
          } else {
            await fetch(`http://localhost:5000/textbox/${tb.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                postId: postId,
                x: tb.x,
                y: tb.y,
                content: tb.content,
              }),
            });
            return tb;
          }
        })
      );

      setTextboxes(updatedTextboxes);

      // 이미지 저장/수정
      await Promise.all(
        images.map((img) => {
          const isNew = img.isNew;
          const url = isNew
            ? `http://localhost:5000/image`
            : `http://localhost:5000/image/${img.id}`;
          const method = isNew ? "POST" : "PATCH";

          return fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: img.id,
              src: img.src,
              x: img.x,
              y: img.y,
              postId: postId,
              userId: userId,
            }),
          });
        })
      );

      // 삭제된 텍스트박스 삭제 요청
      await Promise.all(
        deletedTextboxIds.map((td) =>
          fetch(`http://localhost:5000/textbox/${td}`, { method: "DELETE" })
        )
      );

      // 삭제된 이미지 삭제 요청
      await Promise.all(
        deletedImageIds.map((imgId) =>
          fetch(`http://localhost:5000/image/${imgId}`, { method: "DELETE" })
        )
      );

      alert("저장 완료!");
      navigate(`/post/${postId}`);
    } catch (error) {
      alert("에러가 발생했습니다.");
    }
  };

  const onDiscard = () => setShowAlert(true);

  const handleAlertYes = () => {
    setTextboxes(originalTextboxes);
    setImages(originalImages);
    setDeletedTextboxIds([]);
    setDeletedImageIds([]);
    setEditingId(null);
    setShowAlert(false);
    window.history.back();
  };

  const handleAlertNo = () => {
    setShowAlert(false);
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
      {/* 이미지 업로드 */}
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

export default PostEdit;

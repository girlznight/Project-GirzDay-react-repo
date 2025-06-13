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
    fetch(`http://localhost:5000/textbox?postId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTextboxes(data);
        setOriginalTextboxes(data);
      });

    fetch(`http://localhost:5000/image?postId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setOriginalImages(data);
      });
  }, [id]);

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
          postId: String(id), // 서버에 문자열로 보냄
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
        content: "dummy text",
        x: 100 + prev.length * 30,
        y: 100 + prev.length * 30,
        postId: String(id), // 문자열로 맞춰줌
        isNew: true,
      },
    ]);
    setEditingId(newId);
  };

const handleSave = async () => {
  try {
    // POST 먼저 하고, 받은 결과로 상태 업데이트
    const updatedTextboxes = await Promise.all(
      textboxes.map(async (tb) => {
        if (tb.isNew) {
          const res = await fetch(`http://localhost:5000/textbox`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: String(tb.id),
              postId: String(id),
              x: tb.x,
              y: tb.y,
              content: tb.content,
            }),
          });
          const data = await res.json(); // 서버가 새 id를 반환한다고 가정
          return { ...tb, id: data.id, isNew: false };
        } else {
          // 기존 데이터는 PATCH
          await fetch(`http://localhost:5000/textbox/${(tb.id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              postId: String(id),
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
              postId: String(id),
              userId: Number(userId),
            }),
          });
        })
      );

      // 삭제된 텍스트박스 삭제 요청
      await Promise.all(
        deletedTextboxIds.map((td) =>
          fetch(`http://localhost:5000/textbox/${(td)}`, { method: "DELETE" })
        )
      );

      // 삭제된 이미지 삭제 요청
      await Promise.all(
        deletedImageIds.map((imgId) =>
          fetch(`http://localhost:5000/image/${imgId}`, { method: "DELETE" })
        )
      );

      alert("저장 완료!");
      navigate(`/post/${id}`);
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
    <div className="relative min-h-screen bg-white p-4 overflow-hidden select-none">
      <DndContext onDragEnd={handleDragEnd}>
        <div
          className="relative w-full h-[90vh] bg-white"
          style={{ minHeight: 500 }}
          onClick={handleBoardClick}
        >
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
      <PostMenuBar
        onAddTextbox={handleAddTextbox}
        onAddImage={() => fileInputRef.current.click()}
        onCheck={handleSave}
        fileInputRef={fileInputRef}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAddImage}
      />
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

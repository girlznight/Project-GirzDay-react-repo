import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DiscardButton from "../../components/DiscardButton";
import PostMenuBar from "../../components/PostMenuBar";
import DraggableTextbox from "../../components/DraggableTextbox";
import DraggableImage from "../../components/DraggableImage";

function PostCreate() {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));

  const [textboxes, setTextboxes] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // 화면 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleAddTextbox = () => {
    const newId = Date.now();
    setTextboxes(prev =>
      [
        ...prev,
        {
          id: newId,
          content: "",
          x: 400,
          y: 100 + prev.length * 70, // prev.length 사용!
        },
      ]
    );
    setEditingId(newId);
  };

  // 텍스트박스 내용 변경
  const handleTextboxChange = (id, value) => {
    setTextboxes(textboxes.map(tb =>
      tb.id === id ? { ...tb, content: value } : tb
    ));
  };

  // 텍스트박스 드래그 위치 변경
  const handleTextboxDragStop = (id, x, y) => {
    setTextboxes(textboxes.map(tb =>
      tb.id === id ? { ...tb, x, y } : tb
    ));
  };

  // 텍스트박스 삭제
  const handleTextboxDelete = (id) => {
    setTextboxes(textboxes.filter(tb => tb.id !== id));
  };

  // 이미지 추가
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImages(prev =>
        [
          ...prev,
          {
            id: Date.now(),
            src: ev.target.result,
            x: 200,
            y: 300 + prev.length * 120,
            z: prev.length + 1,
            userId,
          },
        ]
      );
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };


  // 이미지 드래그 위치 변경
  const handleImageDragStop = (id, x, y) => {
    setImages(images.map(img =>
      img.id === id ? { ...img, x, y } : img
    ));
  };

  // 이미지 삭제
  const handleImageDelete = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  // 완료(저장) - 순차 처리
  const handleCheck = () => {
    fetch("http://localhost:5000/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then(res => res.json())
      .then(postRes => {
        const postId = postRes.id;
        // 텍스트박스 먼저 저장
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
          // 그 다음 이미지 저장
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

  const handleDiscard = () => {
    if (window.confirm("정말 작성을 취소하고 나가시겠습니까?")) {
      navigate(-1);
    }
  };

  return (
    <div className="relative min-h-screen bg-white p-4 overflow-hidden">
      {/* 메뉴바 */}
      <PostMenuBar
        onAddTextbox={handleAddTextbox}
        onAddImage={() => fileInputRef.current.click()}
        onCheck={handleCheck}
        fileInputRef={fileInputRef}
        onImageFileChange={handleAddImage}
      />
      {/* 텍스트박스 */}
      { textboxes.map(tb => (
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
          onDragStop={handleTextboxDragStop}
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
          z={img.z}
          onDelete={handleImageDelete}
          onDragStop={handleImageDragStop}
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

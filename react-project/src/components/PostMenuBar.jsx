import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TextIcon from '../assets/postmenubar_text.svg';
import ImageIcon from '../assets/postmenubar_add-image.svg';
import CheckIcon from '../assets/postmenubar_check.svg';
import Textbox from "./TextboxTest";
import Imagebox from "./ImageboxTest";

function PostMenuBar({ mode = "create", postId, initialTextboxes = [], initialImages = [] }) {
  const [textboxes, setTextboxes] = useState(initialTextboxes);
  const [images, setImages] = useState(initialImages);
  const userId = 1;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const addTextbox = () => {
    setTextboxes(prev => [
      ...prev,
      { x: 100, y: 100, content: "", saved: false }
    ]);
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImages(prev => [
        ...prev,
        { x: 150, y: 150, z: 1, src: reader.result }
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleTextboxConfirm = (idx) => {
    const updated = [...textboxes];
    updated[idx].saved = true;
    setTextboxes(updated);
  };

  const handleTextboxDrag = (idx, x, y) => {
    const updated = [...textboxes];
    updated[idx].x = x;
    updated[idx].y = y;
    setTextboxes(updated);
  };

  const handleTextboxChange = (idx, value) => {
    const updated = [...textboxes];
    updated[idx].content = value;
    setTextboxes(updated);
  };

  const handleImageDrag = (idx, x, y) => {
    const updated = [...images];
    updated[idx].x = x;
    updated[idx].y = y;
    setImages(updated);
  };

  // POST 요청 
  const postData = (url, data, method = "POST") => {
    return fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(res => {
      if (!res.ok) throw new Error("요청 실패");
      return res.json();
    });
  };

  

  // url 이 edit 일 때 모드를 "edit" 로 설정
  const handleSubmit = () => {
    const postUrl = mode === "edit"
      ? `http://localhost:5000/post/${postId}`
      : "http://localhost:5000/post";

    const postMethod = mode === "edit" ? "PATCH" : "POST";

    let postIdToUse = postId;

    const postPromise = mode === "edit"
      ? Promise.resolve({ id: postId })  // 이미 존재하는 id 사용
      : postData(postUrl, { userId }, postMethod);

    postPromise
      .then(postRes => {
        if (mode === "create") postIdToUse = postRes.id;

        const textPromises = textboxes
          .filter(tb => tb.saved)
          .map(tb =>
            postData("http://localhost:5000/textbox", {
              x: tb.x,
              y: tb.y,
              content: tb.content,
              postId: postIdToUse,
            })
          );

        const imagePromises = images.map(img =>
          postData("http://localhost:5000/image", {
            x: img.x,
            y: img.y,
            z: img.z,
            src: img.src,
            postId: postIdToUse,
            userId,
          })
        );

        return Promise.all([...textPromises, ...imagePromises]);
      })
      .then(() => {
        alert("Posted!");
        navigate(`/post/${postIdToUse}`);
      })
      .catch(err => {
        console.error(err);
        alert("Error occurred while posting.");
      });
  };

  return (
    <>
      <div className="relative w-full h-[80vh] bg-gray-100 overflow-hidden">
        {textboxes.map((tb, idx) => (
          <Textbox
            key={tb.id ?? idx}
            x={tb.x}
            y={tb.y}
            content={tb.content}
            saved={tb.saved}
            onChange={(value) => handleTextboxChange(idx, value)}
            onConfirm={() => handleTextboxConfirm(idx)}
            onDrag={(x, y) => handleTextboxDrag(idx, x, y)}
          />
        ))}

        {images.map((img, idx) => (
          <Imagebox
            key={img.id ?? idx}
            x={img.x}
            y={img.y}
            src={img.src}
            onDrag={(x, y) => handleImageDrag(idx, x, y)}
          />
        ))}
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[50%] max-w-md h-16 bg-white shadow-lg rounded-2xl px-20 flex justify-between items-center">
        <button onClick={addTextbox}>
          <img src={TextIcon} alt="텍스트박스 추가" className="w-6 h-6" />
        </button>
        <button onClick={addImage}>
          <img src={ImageIcon} alt="이미지 추가" className="w-6 h-6" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <button onClick={handleSubmit}>
          <img src={CheckIcon} alt="저장" className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}

export default PostMenuBar;
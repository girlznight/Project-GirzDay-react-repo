import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext } from "@dnd-kit/core"; // DndContext를 사용하여 드래그 앤 드롭 기능 활성화
import PostMenuBar from "../../components/PostMenuBar";
import DiscardButton from "../../components/DiscardButton";
import DraggableTextbox from "../../components/DraggableTextbox";
import DraggableImage from "../../components/DraggableImage";
import AlertPopup from "../../components/AlertPopup"; 

// PostCreate 컴포넌트
// 사용자로부터 텍스트박스와 이미지를 입력받아 포스트를 생성하는 기능을 제공
// useState 훅을 사용하여 상태 관리, useRef 훅을 사용하여 DOM 요소 참조
// useNavigate 훅을 사용하여 페이지 이동 기능 구현
// DndContext를 사용하여 드래그 앤 드롭 기능 구현
//DndContext는 dnd-kit 라이브러리에서 제공하는 컴포넌트로, 드래그 앤 드롭 기능을 활성화 함

function PostCreate() {
  const fileInputRef = useRef(); // 이미지 업로드 input 참조
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동
  const userId = Number(localStorage.getItem("userId")); // 사용자 ID 가져오기
  const [textboxes, setTextboxes] = useState([]); // 텍스트박스 상태
  const [images, setImages] = useState([]); // 이미지 상태
  const [editingId, setEditingId] = useState(null); // 현재 편집 중인 텍스트박스 ID(편집 모드 활성화 위해 사용)
  const [showAlert, setShowAlert] = useState(false); // 경고 팝업 표시 여부

  // 텍스트박스 추가
  const handleAddTextbox = () => {
    const newId = Date.now(); // 현재 시간 가져와서 숫자로, z 인덱스 없으므로 가장 최신에 만든 텍스트 박스 구분할 필요 X, -> 1, 2, 3... 일 필요 X
    setTextboxes(prev => [
      ...prev,
      {
        id: newId,
        content: "",
        x: 400 + Math.random() * 50, // x 좌표 랜덤 생성, 화면 중앙 고정 생성 시 여러 개 겹치는 경우 보기 힘들어서 화면 중앙 X
        y: 100 + prev.length * 70, //현재 텍스트박스 개수(길이)에 따라 y 좌표 조정, 새로 추가되는 텍스트박스의 y좌표를 아래로 70px 씩 배치
      },
    ]);
    setEditingId(newId);
  };

  // 텍스트박스 내용 변경
  const handleTextboxChange = (id, value) => { //수정 하려는 박스의 id, 값(텍스트 내용) 전달
    setTextboxes(prev =>
      prev.map(tb => tb.id === id ? { ...tb, content: value } : tb) // 수정 하려는 id = id인 텍스트박스의 content를 복사, content value로 변경
    );
  };

  // 텍스트박스 삭제
  const handleTextboxDelete = (id) => {
    setTextboxes(prev => prev.filter(tb => tb.id !== id)); // id가 일치하지 않는 텍스트박스만 남김
    if (editingId === id) setEditingId(null); // 삭제한 텍스트박스가 현재 편집 중인 경우 편집 모드 해제
  };

  // 이미지 추가
  const handleAddImage = (e) => {
    const file = e.target.files[0]; // 파일 선택
    if (!file) return; // 파일이 선택되지 않은 경우 처리
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    const reader = new FileReader(); // FileReader를 사용하여 파일을 읽음
    reader.onload = (ev) => { // 파일 읽기가 완료되면 실행
      const newId = Date.now(); // 숫자 id로 통일
      setImages(prev => [ 
        ...prev, // 기존 이미지 배열 복사, 새 이미지 추가
        {
          id: newId,
          x: 200 + Math.random() * 50, // x 좌표 랜덤 생성, 여러 컴포넌트 겹필 때 알아보기 힘들어서 화면 중앙 아님 
          y: 300 + prev.length * 120,
          z: prev.length + 1, // 쌓임 순서, 이미지 추가 시마다 z 인덱스 증가
          src: ev.target.result, // base64 이미지 데이터
          userId: userId, // 현재 사용자 ID
          // postId는 저장 시 포함
        },
      ]);
    };
    reader.readAsDataURL(file); // 파일을 base64로 읽음
    e.target.value = ""; // 파일 input 초기화, 파일을 다시 선택할 수 있도록
  };

  // 이미지 삭제
  const handleImageDelete = (id) => { //삭제하려는 이미지의 id 전달
    setImages(prev => prev.filter(img => String(img.id) !== String(id))); // 기존 이미지 배열에서 삭제하려는 id와 일치하지 않는 이미지만 남김 -> id 가 같은 이미지는 배열에서 제거
  };

  // 드래그 종료 시 위치 갱신 (dnd-kit 사용)
  const handleDragEnd = (event) => { // 드래그가 끝났을 때 호출, event 객체를 인자로 받음
    const { active, delta } = event; // active: 현재 드래그 중인 요소, delta: 드래그 이동 거리
    if (!active) return; // active가 없으면 return nothing
    setTextboxes(prev => 
      prev.map(tb => // 현재 드래그 중인 텍스트박스의 id와 일치하는 경우
        tb.id === active.id // active.id와 일치하는 텍스트박스만 위치 갱신
          ? { ...tb, x: tb.x + (delta?.x || 0), y: tb.y + (delta?.y || 0) } // 기존 배열의 x, y 좌표에 delta 값을 더함
          : tb // 일치하지 않는 텍스트박스는 그대로 유지
      )
    );
    setImages(prev =>
      prev.map(img => // 현재 드래그 중인 이미지의 id와 일치하는 경우
        img.id === active.id // active.id와 일치하는 이미지만 위치 갱신
          ? { ...img, x: img.x + (delta?.x || 0), y: img.y + (delta?.y || 0) } // 기존 배열의 x, y 좌표에 delta 값을 더함
          : img // 일치하지 않는 이미지는 그대로 유지
      )
    );
  };

  const handleBoardClick = () => setEditingId(null); // 보드 클릭 시 편집 중인 텍스트박스 해제

  const onDiscard = () => setShowAlert(true); // Discard 버튼 클릭 시 경고 팝업 표시

  const handleAlertYes = () => { // 경고 팝업에서 "Yes" 클릭 시
    setShowAlert(false); // 팝업 닫기
    window.history.back(); // 이전 페이지로 이동
  };

  const handleAlertNo = () => setShowAlert(false); // 경고 팝업에서 "No" 클릭 시 팝업 닫기

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
        ).then(() => postId); // 모든 텍스트박스와 이미지 저장 후 postId 반환
      })
      .then((postId) => { // 모든 저장이 완료된 후
        alert("생성 완료!");
        navigate(`/post/${postId}`); // 생성된 포스트로 이동
      })
      .catch(() => { // 에러 처리
        alert("에러가 발생했습니다.");
      });
  };


  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4 overflow-hidden select-none">
      <DndContext onDragEnd={handleDragEnd}> {/* DndContext로 드래그 앤 드롭 기능 활성화 */}
        <div
          className="relative w-full h-[90vh]"
          style={{ minHeight: 500 }}
          onClick={handleBoardClick} // 보드 클릭 시 편집 중인 텍스트박스 해제
        >
          {/* 텍스트박스 */}
          {textboxes.map(tb => ( // 텍스트박스 배열을 순회하며 렌더링
            // 각 텍스트박스 컴포넌트에 필요한 props 전달
            <DraggableTextbox
              key={tb.id}
              id={tb.id}
              content={tb.content}
              x={tb.x}
              y={tb.y}
              editingId={editingId}
              setEditingId={setEditingId} // 편집 중인 텍스트박스 ID 설정 함수
              onChange={handleTextboxChange} // 텍스트박스 내용 변경 함수
              onDelete={handleTextboxDelete} // 텍스트박스 삭제 함수
            />
          ))}
          {/* 이미지 */}
          {images.map((img, idx) => ( // 이미지 배열을 순회하며 렌더링
            <DraggableImage
              key={img.id}
              id={img.id}
              src={img.src}
              x={img.x}
              y={img.y}
              onDelete={handleImageDelete} // 이미지 삭제 함수
              zIndex={img.z ?? idx + 1} // z 인덱스, 없으면 idx + 1로 설정
            />
          ))}
        </div>
      </DndContext>
      {/* 메뉴바 */}
      <PostMenuBar
        onAddTextbox={handleAddTextbox} // 텍스트박스 추가 함수
        onAddImage={() => fileInputRef.current.click()} // 이미지 추가 함수 (파일 input 클릭)
        onCheck={handleCheck} // 완료(저장) 함수
        fileInputRef={fileInputRef} // 파일 input 참조 전달
      />
      {/* 이미지 업로드 input */}
      <input
        ref={fileInputRef} // 파일 input 참조
        type="file"
        accept="image/*"
        style={{ display: "none" }} // 화면에 보이지 않도록 설정
        onChange={handleAddImage} // 이미지 추가 함수 호출
      />
      {/* Discard 버튼 */}
      <DiscardButton onDiscard={onDiscard} />
      {showAlert && ( // 경고 팝업 표시 여부에 따라 AlertPopup 컴포넌트 렌더링
        <AlertPopup
          show={showAlert}
          message={"작성 중인 내용이 사라집니다. 정말로 나가시겠습니까?"}

          onYes={handleAlertYes} // "Yes" 클릭 시 호출
          onNo={handleAlertNo} // "No" 클릭 시 호출
        />
      )}
    </div>
  );
}

export default PostCreate;

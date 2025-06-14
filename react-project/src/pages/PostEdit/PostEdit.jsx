import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import DraggableTextbox from "../../components/DraggableTextbox";
import DraggableImage from "../../components/DraggableImage";
import PostMenuBar from "../../components/PostMenuBar";
import DiscardButton from "../../components/DiscardButton";
import AlertPopup from "../../components/AlertPopup";

function PostEdit() {
  const { id } = useParams(); //url 매개변수
  const postId = id; 
  const navigate = useNavigate(); //페이지 이동
  const fileInputRef = useRef(); // 파일 input 요소를 직접 제어하기 위한 ref
  const userId = Number(localStorage.getItem("userId")); // 사용자 아이디

  const [textboxes, setTextboxes] = useState([]); // 현재 화면에 표시될 textbox
  const [originalTextboxes, setOriginalTextboxes] = useState([]); //처음 불러온 텍스트박스 원본 데이터
  const [images, setImages] = useState([]); // 화면에 표시될 이미지
  const [originalImages, setOriginalImages] = useState([]); // 처음 불러온 이미지 원본 
  const [showAlert, setShowAlert] = useState(false); // 취소 시 경고 팝업 표시 여부

  const [deletedTextboxIds, setDeletedTextboxIds] = useState([]); // 삭제한 텍스트박스 목록
  const [deletedImageIds, setDeletedImageIds] = useState([]); // 삭제한 이미지 목록

  const [editingId, setEditingId] = useState(null); // 편집 중인 텍스트박스


  // 텍스트박스, 이미지 불러오기
  useEffect(() => {
    fetch(`http://localhost:5000/textbox?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setTextboxes(data); // 현재 텍스트박스 상태 저장
        setOriginalTextboxes(data); // 원본 백업 저장
      });

    fetch(`http://localhost:5000/image?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data); //현재 이미지 상태 저장
        setOriginalImages(data); // 원본 백업 저장
      });
  }, [postId]); // postid가 바뀔 때마다 실행

  // 텍스트박스 내용 변경
  const handleTextboxChange = (id, value) => {
    setTextboxes((prev) =>
      prev.map((tb) =>
        tb.id === id ? { ...tb, content: value } : tb // 해당 id를 가진 텍스트박스의 content만 변경
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
    setEditingId(null); // 수정 중 상태 해제
  };

  // 텍스트박스 삭제
  const handleTextboxDelete = (id) => {
    const isOriginal = originalTextboxes.some((tb) => tb.id === id);

    if (isOriginal) {
      setDeletedTextboxIds((prev) => [...prev, id]); //기존 텍스트박스일 경우 삭제 목록에 id 추가
    }
    setTextboxes((prev) => prev.filter((tb) => tb.id !== id)); //삭제한 텍스트박스의 id와 일치하지 않는 텍스트 박스만 화면에 표시

    if (editingId === id) setEditingId(null); // 수정 중 상태 해제
  };

  // 이미지 삭제
  const handleImageDelete = (id) => {
    const isOriginal = originalImages.some((img) => img.id === id); //원본인지 확인

    if (isOriginal) {
      setDeletedImageIds((prev) => [...prev, id]); // 삭제 목록 추가
    }
    setImages((prev) => prev.filter((img) => img.id !== id)); // id 일치하지 않는 이미지만 화면에 표시
  };

  // 이미지 추가
  const handleAddImage = (e) => {
    const file = e.target.files[0]; //파일 선택
    if (!file) return; //파일 선택되지 않은 경우

    const reader = new FileReader(); //FileReader로 파일 읽음
    reader.onload = (ev) => {
      const newId = Date.now(); // id 생성
      setImages((prev) => [
        ...prev,
        {
          id: newId,
          src: ev.target.result, //base64 이미지 데이터
          x: 200 + Math.random() * 50, //임의 위치 지정
          y: 300 + prev.length * 120,
          z: prev.length + 1,
          postId: postId,
          userId,
          isNew: true, // 새 이미지 표시
        },
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // input 초기화
  };

  // 드래그 종료 후 위치 갱신
  const handleDragEnd = (event) => {
    const { active, delta } = event;// active: 드래그한 요소, delta: 움직인 거리 (x, y)
    if (!active) return; //드래그한 요소 없으면 아무 작업 안 함

    //텍스트박스 위치 업데이트
    setTextboxes((prev) => 
      prev.map((tb) =>
        tb.id === active.id //드래그 중인 id와 일치하는 경우
          ? { ...tb, x: tb.x + (delta?.x || 0), y: tb.y + (delta?.y || 0) } // x와 y 좌표를 움직인 거리만큼 더해줌
          : tb // 일치하지 않으면 그대로 유지
      )
    );
    //이미지 위치 업데이트
    setImages((prev) =>
      prev.map((img) =>
        img.id === active.id //드래그 중인 id와 일치하는 경우
          ? { ...img, x: img.x + (delta?.x || 0), y: img.y + (delta?.y || 0) }// x와 y 좌표를 움직인 거리만큼 더해줌
          : img // 일치하지 않으면 그대로 유지
      )
    );
  };

  const handleBoardClick = () => setEditingId(null); // 보드 클릭 시 편집 중인 텍스트박스 해제 

  // 텍스트박스 추가
  const handleAddTextbox = () => {
    const newId = Date.now(); // 현재 시간 이용해서 id 생성 
    setTextboxes((prev) => [
      ...prev,
      {
        id: newId,
        content: "",
        x: 100 + prev.length * 30, // x 좌표를 텍스트 박스 개수에 따라 다르게 설정
        y: 100 + prev.length * 30, // y좌표를 텍스트 박스 개수에 따라 다르게 설정
        postId: postId, 
        isNew: true, // 새로 추가된 텍스트박스 표시
      },
    ]);
    setEditingId(newId); //추가한 텍스트박스를 편집 상태로 설정
  };

  const handleSave = async () => {
    try {
      // 텍스트박스 저장/수정
      const updatedTextboxes = await Promise.all(
        textboxes.map(async (tb) => {
          if (tb.isNew) { //새로 추가된 텍스트박스는 POST 요청
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
            return { ...tb, id: data.id, isNew: false }; //저장한 건 false로 변경
          } else { //기존 텍스트박스는 PATCH요청
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

      setTextboxes(updatedTextboxes); //수정된 텍스트박스 상태 반영

      // 이미지 저장/수정
      await Promise.all(
        images.map((img) => {
          const isNew = img.isNew;
          const url = isNew
            ? `http://localhost:5000/image` 
            : `http://localhost:5000/image/${img.id}`;
          const method = isNew ? "POST" : "PATCH"; //새 이미지이면 POST, 기존 이미지면 PATCH

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
      navigate(`/post/${postId}`); //저장한 게시물 페이지로 이동
    } catch (error) {
      alert("에러가 발생했습니다.");
    }
  };

  const onDiscard = () => setShowAlert(true); // discord 버튼 클릭 시 경고 팝업 표시

  const handleAlertYes = () => { //yes 클릭 시
    setTextboxes(originalTextboxes); //텍스트박스 원래 상태로 되돌림
    setImages(originalImages); // 이미지 원래 상태로 되돌림
    setDeletedTextboxIds([]); // 삭제된 텍스트박스 목록 초기화
    setDeletedImageIds([]); //삭제된 이미지 목록 초기화
    setEditingId(null); //수정 중인 항목 해제
    setShowAlert(false); //팝업 닫기
    window.history.back(); // 이전 페이지로 이동
  };

  const handleAlertNo = () => {
    setShowAlert(false); //팝업 닫기
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
              editingId={editingId} //수정 중인 텍스트박스 id
              setEditingId={setEditingId} // 수정 상태 변경 함수
              onChange={handleTextboxChange} // 텍스트 박스 내용 변경 함수
              onDelete={handleTextboxDelete} // 텍스트 박스 삭제 함수
              onCancel={handleTextboxCancel} // 텍스트박스 수정 취소 함수
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
              onDelete={handleImageDelete} //이미지 삭제 함수
            />
          ))}
        </div>
      </DndContext>
      {/* 메뉴바 */}
      <PostMenuBar
        onAddTextbox={handleAddTextbox} //텍스트 박스 추가 함수
        onAddImage={() => fileInputRef.current.click()} //이미지 추가 함수
        onCheck={handleSave} //저장 함수
        fileInputRef={fileInputRef} // 이미지 input 참조 전달
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

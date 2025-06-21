import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../../components/SideBar";
import SidebarToggleBtn from "../../components/SidebarToggleButton";
import AlertPopup from "../../components/AlertPopup";
import CommentPopup from "../../components/CommentPopup";
import CommentEditPopup from "../../components/CommentEditPopup";
import { DndContext } from "@dnd-kit/core";  // DndContext -> drag and drop 기능 활성화
import Drag from "../../components/Drag";
import { getMaxLineLength } from "../../components/textboxUtils";

import CommentIcon from "../../assets/post_comment.svg";
import ShareIcon from "../../assets/post_share.svg";
import EditIcon from "../../assets/sidebar_pencil.svg";
import DeleteIcon from "../../assets/discardbutton_trash.svg";
import NoteBg from "../../assets/sticky-note.png";

import usePostOwner from "../../hooks/usePostOwner";
import useTextboxes from "../../hooks/useTextboxes";
import useImages from "../../hooks/useImages";
import usePostits from "../../hooks/usePostits";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useShare } from "../../hooks/useShare";
import { handleAlertYes as deletePost } from "../../hooks/useDeletePost";
import { handleDragEnd } from "../../hooks/useDragHandler";
import { saveComment as saveCommentFn } from "../../hooks/useCommentPopup";

// Post 페이지
// 사용자가 만든 페이지를 보여주는 기능을 제공
// DndContext를 사용하여 comment (sticky-note = post-it) 이동 기능 구현
// DndContext는 dnd-kit 라이브러리에서 제공하는 컴포넌트로, drag n drop 기능 활성화 함
// useNavigate 훅을 사용하여 페이지 이동 기능 구현

function PostTextbox({ content }) {
  const textareaRef = useRef(null);

  // DraggableTextbox와 동일한 width 계산
  const charWidth = 18;
  const minWidth = 200;
  const maxWidth = 500;
  const maxLineLength = getMaxLineLength(content);
  const calcWidth = Math.min(Math.max(minWidth, maxLineLength * charWidth), maxWidth);

  // 높이 자동 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  return (
    <div className="px-4 py-2 bg-transparent" 
      style={{
        fontFamily: "inherit",
        display: "inline-block",
        whiteSpace: "pre-wrap",
        width: `${calcWidth}px`,
        minWidth: `${minWidth}px`,
        maxWidth: `${maxWidth}px`,
        padding: "12px 4px",
      }}
    >
      <textarea
        ref={textareaRef}
        value={content}
        readOnly
        className="text-black text-center text-base bg-transparent outline-none"
        style={{
          display: "block",
          fontFamily: "inherit",
          width: "100%",
          minWidth: "100%",
          maxWidth: "100%",
          border: "none",
          background: "transparent",
          overflow: "hidden",
          resize: "none",
        }}
        rows={1}
      />
    </div>
  );
}

export default function Post() {
  const { id } = useParams(); // useParams 훅을 사용해서 현재 URL 파라미터에서의 ID 값을 id 변수에 저장
  const nav = useNavigate(); // useNavigate 훅 사용해서 페이지 이동
  const myId = Number(localStorage.getItem("userId") || 0); // userID로 저장된 값을 localStorage에서 꺼내서 number로 변환, userId가 없다면 0 반환

  const [showSide, setShowSide] = useState(false); // side-bar 표시 여부
  const [showShareAlert, setShowShareAlert] = useState(false); // 공유 알림 팝업 표시 여부
  const [openCmt, setOpenCmt] = useState(false); // 포스트잇 생성 팝업 열기 여부
  const [commentText, setCommentText] = useState(""); // 포스트잇 입력창 내용
  const [showAlert, setShowAlert] = useState(false); // 삭제 확인 알림창 표시 여부

  const [hoverId, setHoverId] = useState(null); // 현재 마우스 올린 Post it의 ID (... 버튼 노출 제어용)
  const [editingId, setEditingId] = useState(null); // 편집 중인 Post it의 ID (어떤 post it을 수정할지)
  const [draftText, setDraftText] = useState(""); // 편집 중인 post it의 내용 (textarea 안에 임시 저장)

  const sidebarRef = useRef(null); // SideBar 컴포넌트의 DOM 요소를 참조

  const ownerId = usePostOwner(id); // 현재 Post의 작성자 userId
  const isOwner = ownerId === myId; // 현재 사용자가 post 소유자인지 확인
  const [textboxes] = useTextboxes(id); // text box 상태
  const [images] = useImages(id); // image 상태
  const [postits, setPostits] = usePostits(id); // post it 상태

  useOutsideClick(sidebarRef, setShowSide, setHoverId);
  const { onShareClick, handleShareYes, handleShareNo } = useShare(setShowShareAlert);

  function goEdit() { nav(`/post/edit/${id}`); }
  function handleLogout() { localStorage.removeItem("userId"); }
  function onDiscard() { setShowAlert(true); }
  function handleAlertNo() { setShowAlert(false); }

  function saveComment() {
    saveCommentFn({ commentText, setPostits, postits, myId, setOpenCmt, setCommentText, NoteBg, postId: id });
  }

  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4 overflow-hidden select-none">
      {/* 로그아웃 버튼 */}
      <button onClick={handleLogout} className="fixed top-6 right-8 z-50 text-sm text-blue-600">Logout</button>

      {/* showSide가 false이면 sidebar toggle button이 보이기, 클릭 시 사이드바 열기 */}
      {!showSide && <SidebarToggleBtn onClick={() => setShowSide(true)} />}
      {/* showSide가 true이면 sidebar 보이기, sidebar에서 닫기 버튼을 누르면사이드바 닫기 */}
      {showSide && <div ref={sidebarRef}><Sidebar onClose={() => setShowSide(false)} /></div>}

      <div className="relative w-full h-[90vh] overflow-hidden">
        {/* DndContext로 drag and drop 기능 활성화 */}
        <DndContext onDragEnd={(e) => handleDragEnd(e, myId, postits, setPostits)}>

          {/* 텍스트박스 */}
          {textboxes.map((tb, i) => (
            <div 
              key={tb.id} 
              style={{ 
                position: "absolute", 
                left: tb.x, 
                top: tb.y, 
                zIndex: tb.zIndex ?? i + 1, 
                minWidth: 200 
              }} 
              tabIndex={0} 
              className="group"
            >
              <PostTextbox content={tb.content} />
            </div>
          ))}

          {/* 포스트잇 */}
          {postits.map((pt, i) => ( // 포스트잇 배열을 순회하며 렌더링
            <Drag key={pt.id} id={pt.id} position={{ x: pt.x, y: pt.y }}>
              <div
                style={{
                  backgroundImage: `url(${NoteBg})`, // 포스트잇 배경 이미지
                  backgroundSize: "cover", // 배경 이미지 꽉 채우기
                  backgroundPosition: "center", // 배경 이미지 중앙 정렬
                  zIndex: pt.zIndex ?? i + 100, // z 인덱스, 없으면 index + 100으로 설정
                  cursor: isOwner ? "grab" : "default", // 현재 사용자가 포스트잇 작성자이면 cursor를 grab으로 변경, 아니면 default
                  padding: "1.2rem", // 내부 여백
                  display: "flex", // flex 레이아웃 사용
                  alignItems: "flex-start", justifyContent: "flex-start", // 세로축, 가로축 왼쪽 정렬
                  whiteSpace: "pre-wrap",  // 줄바꿈&공백 그대로 유지(자동 줄바꿈)
                  wordBreak: "break-word", // 단어가 길어서 넘치면 단어 중간에서 줄바꿈
                  outline: "none" // focus 받았을 때 외곽선 나타나지 않음
                }}
                className="select-none text-sm xl:text-base 2xl:text-lg text-black w-[160px] h-[160px] xl:w-[180px] xl:h-[180px] 2xl:w-[190px] 2xl:h-[190px] transition-all duration-300"
                // 텍스트 선택(드래그) 불가
                // 글자 크기 : small, xl(1280px 이상): base, 2xl(1536px이상): large
                // w, h : 너비, 높이 지정
                //  트랜지션(애니메이션) 효과 적용, 지속시간 300ms

                onMouseEnter={() => pt.userId === myId && setHoverId(pt.id)} /* 마우스 커서가 내가 쓴 post it 위에 올려졌을 때만 hover 시작 */
                onMouseLeave={() => pt.userId === myId && setHoverId(null)} /* 마우스 커서가 내가 쓴 post it을 벗어나면 hover 끝 */
              >
                {/* 포스트잇 내용 출력 */}
                {pt.content}
                {/* 마우스 커서가 내가 쓴 post it 위에 올려졌을 때만 나타나는 옵션(...) 버튼 */}
                {hoverId === pt.id && ( // hoverId가 현재 순회 중인 pt.id와 같을 때만 버튼 표시
                  <button className="absolute top-1 right-3 pointer-events-auto"
                    onPointerDown={e => { 
                      e.stopPropagation(); // 부모(Drag 컴포넌트)로 전파되는 걸 차단
                      e.preventDefault(); // 기본 드래그 동작 차단
                    }}
                    onClick={() => { 
                      setEditingId(pt.id); /* 어떤 포스트잇을 편집할지 ID를 기억 */
                    setDraftText(pt.content); /* 편집 팝업 안의 textarea에 원래 내용을 채워 넣음 */
                    }}
                  >
                    …
                  </button>
                )}
              </div>
            </Drag>
          ))}

          {/* 이미지 */}
          {images.map((img, i) => ( // 이미지 배열 순회하며 렌더링
            <div key={img.id} style={{ 
              position: "absolute", 
              left: img.x, top: img.y, 
              width: img.width || 200, height: img.height || 200, zIndex: img.zIndex ?? i + 50  // z 인덱스, 없으면 index + 50으로 설정
              }} 
              className="select-none pointer-events-none"
            >
              <img src={img.src} alt="" 
              className="object-contain w-full h-full" 
              draggable={false} // 마우스로 drag 금지
              />
            </div>
          ))}
        </DndContext>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex gap-6">
        {/* 버튼 클릭 -> CommentPopup 열기 (포스트잇 추가) */}
        <button onClick={() => setOpenCmt(true)}>
          <img src={CommentIcon} alt="comment" className="w-8 h-8" />
        </button> 
        {/* CommentPopup이 false일 때 아래 버튼들 보여주기 */}
        {!openCmt && (
          <>
            {/* 클릭 시 공유 기능 실행 */}
            <button onClick={onShareClick}>
              <img src={ShareIcon} alt="share" className="w-8 h-8" />
            </button>
            {/* 현재 사용자가 작성자일 때만 실행 */}
            {isOwner && (
              <>
                {/* 클릭 시 PostEdit로 이동 */}
                <button onClick={goEdit}>
                  <img src={EditIcon} alt="edit" className="w-8 h-8" />
                </button>
                {/* 클릭 시 삭제 확인 팝업 열기 */}
                <button onClick={onDiscard}>
                  <img src={DeleteIcon} alt="delete" className="w-8 h-8" />
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* 공유 확인 팝업 */}
      <AlertPopup 
        show={showShareAlert} 
        message="링크를 복사하시겠습니까?" 
        onYes={handleShareYes} // Yes 클릭 시 호출
        onNo={handleShareNo} // No 클릭 시 호출
      />

      {/* 삭제 확인 팝업 */}
      {showAlert && 
        <AlertPopup 
          show={showAlert} 
          message="정말로 삭제하시겠습니까?" 
          onYes={() => deletePost({ textboxes, images, postits, id, setShowAlert, nav })}  // Yes 클릭 시 호출
          onNo={handleAlertNo} // No 클릭 시 호출
        />
      }

      {/* 댓글 팝업 */}
      <CommentPopup 
        open={openCmt} // popup 상태 관리 true->열림, false->닫힘
        onClose={() => setOpenCmt(false)} // popup 닫기
        value={commentText} // comment 입력창 현재 상태
        onChange={setCommentText} // 입력창에 글 쓸 때마다 commentText 업데이트
        onSave={saveComment} // save btn 클릭 -> comment contents save
      />

      {/* 편집 팝업: CommentEditPopup */}
      <CommentEditPopup
        open={editingId !== null} // 편집 팝업 열지 말지 결정 (editingId가 null이 아니면 열기)
        value={draftText} // 팝업 textarea에 표시할 텍스트
        onChange={setDraftText} // textarea 변경 시 draftText 업데이트
        onClose={() => setEditingId(null)} // × 클릭 시 편집 모드 종료
        onSave={() => {
          fetch(`http://localhost:5000/postit/${editingId}`, {
            method: "PUT", // PUT 메서드 사용
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              ...postits.find(p => p.id === editingId), // 기존 post it 데이터
              content: draftText // 수정된 내용 덮어쓰기
            })
          }).then(() => {
            setPostits(ps => 
              ps.map(p => 
                p.id === editingId ? { ...p, content: draftText } : p // 로컬 post it 배열 순회하며 해당 아이디의 content만 교체
            )
          ); 
            setEditingId(null); // 편집 모드 종료
          });
        }}
        onDelete={() => { // 휴지통 버튼 클릭 시 서버에 DELETE, 로컬 상태에서 제거
          fetch(`http://localhost:5000/postit/${editingId}`, { method: "DELETE" // DELETE 메서드 사용
          }).then(() => {
            setPostits(ps => ps.filter(p => p.id !== editingId)); // 해당 post it만 필터링
            setEditingId(null); // 편집 모드 종료
          });
        }}
      />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../../components/SideBar";
import SidebarToggleBtn from "../../components/SidebarToggleButton";
import AlertPopup from "../../components/AlertPopup";
import CommentPopup from "../../components/CommentPopup";
import { DndContext } from "@dnd-kit/core"; // DndContext -> drag and drop 기능 활성화
import Drag from "../../components/Drag";

import CommentIcon from "../../assets/post_comment.svg";
import ShareIcon from "../../assets/post_share.svg";
import EditIcon from "../../assets/sidebar_pencil.svg";
import DeleteIcon from "../../assets/discardbutton_trash.svg";
import NoteBg from "../../assets/sticky-note.png";

// Post 페이지
// 사용자가 만든 페이지를 보여주는 기능을 제공
// DndContext를 사용하여 comment (sticky-note = post-it) 이동 기능 구현
// DndContext는 dnd-kit 라이브러리에서 제공하는 컴포넌트로, drag n dro 기능 활성화 함
// useNavigate 훅을 사용하여 페이지 이동 기능 구현

export default function Post() {
  const { id } = useParams(); // useParams 훅을 사용해서 현재 URL 파라미터에서의 ID 값을 id 변수에 저장
  const nav = useNavigate(); // useNavigate 훅 사용해서 페이지 이동
  const myId = Number(localStorage.getItem("userId") || 0); // userID로 저장된 값을 localStorage에서 꺼내서 number로 변환, userId가 없다면 0 반환

  const [showSide, setShowSide] = useState(false); // side-bar 표시 여부
  const [textboxes, setTextboxes] = useState([]); // text box 상태
  const [images, setImages] = useState([]); // image 상태
  const [postits, setPostits] = useState([]); // post it 상태
  const [showShareAlert, setShowShareAlert] = useState(false); // 공유 alert 표시 여부
  const [openCmt, setOpenCmt] = useState(false); // comment pop-up 상태
  const [commentText, setCommentText] = useState(""); // comment 내용 상태
  const [ownerId, setOwnerId] = useState(null); // post의 owner의 id 저장하는 용도
  const [showAlert, setShowAlert] = useState(false); // 경고 팝업 표시 여부

  const sidebarRef = useRef(null); // SideBar 컴포넌트의 DOM 요소를 참조
  const isOwner = ownerId === myId; // 현재 사용자가 post 소유자인지 확인

  useEffect(() => {
    // fetch 함수로 서버에 데이터 요청 (비동기 동작) -> JSON으로 변환
    // 현재 post의 정보를 가져와서, 작성자 아이디(ownerId)를 상태로 저장
    fetch(`http://localhost:5000/post/${id}`)
      .then(r => r.json())
      .then(p => setOwnerId(Number(p.userId)));
    // text box 데이터 가져오기
    fetch(`http://localhost:5000/textbox?postId=${id}`)
      .then(r => r.json())
      .then(setTextboxes);
    // 이미지 데이터 가져오기
    fetch(`http://localhost:5000/image?postId=${id}`)
      .then(r => r.json())
      .then(setImages);
    // 포스트잇 가져오기
    fetch(`http://localhost:5000/postit?postId=${id}`)
      .then(r => r.json())
      .then(setPostits);
  }, [id]);

  // side bar 외부 클릭 시 닫음
  useEffect(() => {
    // 클릭한 요소(e.target)가 sidebar 내부에 존재하지 않으면 닫음
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSide(false);
      }
    }
    // mousedown 발생할 때마다 handleClickOutside 함수가 실행되도록 eventListener 등록
    document.addEventListener("mousedown", handleClickOutside);
    // 컴포넌트가 사라질 때(unmount될 때) 실행
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 공유 팝업 열기
  function onShareClick() {
    setShowShareAlert(true);
  }
  // share 하기
  function handleShareYes() {
    // 공유 팝업 닫기
    setShowShareAlert(false);
    // 현재 페이지 url 복사
    navigator.clipboard.writeText(window.location.href)
      .then(() => { // 복사 성공
        window.alert("링크가 복사되었습니다!");
      })
      .catch(() => { // 복사 실패
        window.alert("클립보드 복사에 실패했습니다.");
      });
  }
  // share 안 하기
  function handleShareNo() {
    // 공유 팝업 닫기
    setShowShareAlert(false);
  }

  // PostEdit 페이지 가기
  function goEdit() { nav(`/post/edit/${id}`); }
  // 로그아웃하기
  function handleLogout() {
    // local storage에서 userId 삭제
    localStorage.removeItem("userId");
  }

  // async -> promise 반환 (비동기로 동작)
  // await -> promise 완료될 때까지 기다리고 결과 반환
  async function handleAlertYes() {
    const delTb = textboxes.map(tb =>
      fetch(`http://localhost:5000/textbox/${tb.id}`, { method: "DELETE" })
    );
    const delImg = images.map(img =>
      fetch(`http://localhost:5000/image/${img.id}`, { method: "DELETE" })
    );
    const delPt = postits.map(pt =>
      fetch(`http://localhost:5000/postit/${pt.id}`, { method: "DELETE" })
    );
    await Promise.all([...delTb, ...delImg, ...delPt]);
    await fetch(`http://localhost:5000/post/${id}`, { method: "DELETE" });
    setShowAlert(false);
    setTimeout(async () => {
      alert("삭제되었습니다!");
      const latest = await fetch("http://localhost:5000/post?_sort=id&_order=desc")
        .then(r => r.json()).then(ls => ls[0]);
      nav(`/post/${latest?.id || "create"}`);
    }, 200);
  }
  function handleAlertNo() { setShowAlert(false); }
  function onDiscard() { setShowAlert(true); }

  function handleDragEnd({ active, delta }) {
    if (!delta) return;
    const activeId = String(active.id);
    setPostits(prev =>
      prev.map(pt => {
        if (String(pt.id) !== activeId) return pt;
        const updated = { ...pt, x: pt.x + delta.x, y: pt.y + delta.y };
        if (isOwner) {
          fetch(`http://localhost:5000/postit/${pt.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
          });
        }
        return updated;
      })
    );
  }

  function saveComment() {
    if (!commentText.trim()) return;
    const nc = {
      id: crypto.randomUUID(),
      postId: id,
      userId: myId,
      content: commentText,
      imgSrc: NoteBg,
      x: 120, y: 120, zIndex: 60
    };
    fetch("http://localhost:5000/postit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nc)
    }).then(() => setPostits(p => [...p, nc]));
    setOpenCmt(false);
    setCommentText("");
  }

  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4">
      <button
        onClick={handleLogout}
        className="fixed top-6 right-8 z-50 text-sm text-blue-600"
      >
        Logout
      </button>

      {!showSide && <SidebarToggleBtn onClick={() => setShowSide(true)} />}
      {showSide && <div ref={sidebarRef}><Sidebar onClose={() => setShowSide(false)} /></div>}

      <div className="relative w-full h-[90vh] overflow-hidden">
        <DndContext onDragEnd={handleDragEnd}>
          {textboxes.map((tb, i) => (
            <div
              key={tb.id}
              style={{
                position: "absolute",
                left: tb.x, top: tb.y,
                zIndex: tb.zIndex || i + 1,
                maxWidth: 320, whiteSpace: "pre-wrap"
              }}
              className="text-base text-black"
            >
              {tb.content}
            </div>
          ))}

          {postits.map((pt, i) => (
            <Drag key={pt.id} id={pt.id} position={{ x: pt.x, y: pt.y }}>
              <div
                style={{
                  width: 220, height: 220,
                  backgroundImage: `url(${pt.imgSrc || NoteBg})`,
                  backgroundSize: "cover", backgroundPosition: "center",
                  zIndex: pt.zIndex || i + 100,
                  cursor: isOwner ? "grab" : "default",
                  padding: "1.2rem", display: "flex",
                  alignItems: "flex-start", justifyContent: "flex-start",
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                  outline: "none"
                }}
                className="select-none text-base text-black"
              >
                {pt.content}
              </div>
            </Drag>
          ))}

          {images.map((img, i) => (
            <div
              key={img.id}
              style={{
                position: "absolute",
                left: img.x, top: img.y,
                width: img.width || 200, height: img.height || 200,
                zIndex: img.zIndex || i + 50
              }}
              className="select-none pointer-events-none"
            >
              <img
                src={img.src} alt=""
                className="object-contain w-full h-full"
                draggable={false}
              />
            </div>
          ))}
        </DndContext>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex gap-6">
        <button onClick={() => setOpenCmt(true)}>
          <img src={CommentIcon} alt="comment" className="w-8 h-8" />
        </button>
        {!openCmt && (
          <>
            <button onClick={onShareClick}>
              <img src={ShareIcon} alt="share" className="w-8 h-8" />
            </button>
            {isOwner && (
              <>
                <button onClick={goEdit}>
                  <img src={EditIcon} alt="edit" className="w-8 h-8" />
                </button>
                <button onClick={onDiscard}>
                  <img src={DeleteIcon} alt="delete" className="w-8 h-8" />
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* 공유 전 확인 팝업 */}
      <AlertPopup
        show={showShareAlert}
        message="링크를 복사하시겠습니까?"
        onYes={handleShareYes}
        onNo={handleShareNo}
      />

      {/* 삭제 확인 팝업 */}
      {showAlert && (
        <AlertPopup
          show={showAlert}
          message="정말로 삭제하시겠습니까?"
          onYes={handleAlertYes}
          onNo={handleAlertNo}
        />
      )}

      {/* 댓글 팝업 */}
      <CommentPopup
        open={openCmt}
        onClose={() => setOpenCmt(false)}
        value={commentText}
        onChange={setCommentText}
        onSave={saveComment}
      />
    </div>
  );
}
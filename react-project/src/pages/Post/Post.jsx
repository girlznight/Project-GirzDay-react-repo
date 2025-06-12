/* 전부 챗지피티 */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams }      from "react-router-dom";

import Sidebar          from "../../components/SideBar";
import SidebarToggleBtn from "../../components/SidebarToggleButton";
import AlertPopup       from "../../components/AlertPopup";
import CommentPopup     from "../../components/CommentPopup";

import { DndContext }   from "@dnd-kit/core";
import Drag             from "../../components/Drag";

import CommentIcon  from "../../assets/post_comment.svg";
import ShareIcon    from "../../assets/post_share.svg";
import EditIcon     from "../../assets/sidebar_pencil.svg";
import DeleteIcon   from "../../assets/discardbutton_trash.svg";
import NoteBg       from "../../assets/sticky-note.png";

export default function Post() {
  const { id }   = useParams();
  const nav      = useNavigate();
  const myId     = Number(localStorage.getItem("userId") || 0);

  const [showSide , setShowSide] = useState(false);
  const [notes    , setNotes]    = useState([]);
  const [images   , setImages]   = useState([]);
  const [copied   , setCopied]   = useState(false);
  const [openCmt  , setOpenCmt]  = useState(false);
  const [cText    , setCText]    = useState("");

  const sideRef = useRef(null);

  const isOwner = notes.some(tb => Number(tb.userId) === myId);

  useEffect(() => {
    function handleOut(e) {
      if (sideRef.current && !sideRef.current.contains(e.target)) {
        setShowSide(false);
      }
    }
    document.addEventListener("mousedown", handleOut);
    return () => document.removeEventListener("mousedown", handleOut);
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/textbox?postId=${id}`)
      .then(r => r.json()).then(setNotes);

    fetch(`http://localhost:5000/image?postId=${id}`)
      .then(r => r.json()).then(setImages);
  }, [id]);

  function share() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function goEdit()  { nav(`/post/edit/${id}`); }
  function handleLogout() {
    if (window.confirm("로그아웃할까요?")) {
      localStorage.removeItem("userId");
      nav("/login");
    }
  }

  async function delPost() {
    const ok = window.confirm("삭제할까요?");
    if (!ok) return;
    await fetch(`http://localhost:5000/post/${id}`, { method:"DELETE" });
    nav("/");
  }

  function handleDragEnd(event) {
    const { active, delta } = event;
    if (!delta) return;

    setNotes(prev => prev.map(tb => {
      if (tb.id !== active.id) return tb;
      if (!(isOwner && tb.userId === myId)) return tb;

      const updated = {
        ...tb,
        x: tb.x + delta.x,
        y: tb.y + delta.y,
      };

      fetch(`http://localhost:5000/textbox/${tb.id}`, {
        method :"PUT",
        headers: { "Content-Type":"application/json" },
        body   : JSON.stringify(updated),
      });

      return updated;
    }));
  }


  function saveComment() {
    if (!cText.trim()) return;

    const newTb = {
      id: crypto.randomUUID(),
      postId: id,
      userId: myId,
      content: cText,
      imgSrc: NoteBg,
      x: 120, y: 120, zIndex: 60,
    };

    fetch("http://localhost:5000/textbox", {
      method :"POST",
      headers: { "Content-Type":"application/json" },
      body   : JSON.stringify(newTb),
    }).then(() => setNotes(prev => [...prev, newTb]));

    setOpenCmt(false);
    setCText("");
  }

 
  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4">

      {/* 로그아웃 */}
      <button
        onClick={handleLogout}
        className="fixed top-6 right-8 z-50 text-sm text-blue-600"
      >Logout</button>

      {/* 사이드바 */}
      {!showSide && <SidebarToggleBtn onClick={() => setShowSide(true)} />}
      {showSide && (
        <div ref={sideRef}><Sidebar onClose={() => setShowSide(false)} /></div>
      )}

      {/* 게시글 보드  */}
      <div className="relative w-full h-[70vh] min-h-[500px]">
        <DndContext onDragEnd={handleDragEnd}>

          {/* 텍스트 포스트잇 */}
          {notes.map((tb, idx) => (
            <Drag key={tb.id} id={tb.id} position={{ x: tb.x, y: tb.y }}>
              <div
                style={{
                  width:320, height:320,
                  background:`url(${tb.imgSrc || NoteBg}) center/cover`,
                  zIndex: tb.zIndex || idx + 1,
                  cursor: isOwner && tb.userId === myId ? "grab" : "default",
                }}
                className="px-6 py-4 select-none whitespace-pre-wrap break-words"
              >
                {tb.content}
              </div>
            </Drag>
          ))}

        </DndContext>

        {/* 일반 이미지 */}
        {images.map((img, idx) => (
          <img
            key={img.id}
            src={img.src}
            alt=""
            className="absolute object-contain pointer-events-none select-none"
            style={{
              left:img.x, top:img.y,
              width:img.width||200, height:img.height||200,
              zIndex:img.zIndex||idx+50
            }}
          />
        ))}
      </div>

      {/* 우하단 아이콘 */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-6">
        <button onClick={() => setOpenCmt(true)}>
          <img src={CommentIcon} alt="comment" className="w-8 h-8" />
        </button>

        {!openCmt && (
          <>
            <button onClick={share}>
              <img src={ShareIcon} alt="share" className="w-8 h-8" />
            </button>

            {isOwner && (
              <>
                <button onClick={goEdit}>
                  <img src={EditIcon} alt="edit" className="w-8 h-8" />
                </button>
                <button onClick={delPost}>
                  <img src={DeleteIcon} alt="delete" className="w-8 h-8" />
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* 링크 복사 알림 */}
      {copied && (
        <AlertPopup onClose={() => setCopied(false)}>
          <div className="px-6 py-4">링크가 복사되었습니다!</div>
        </AlertPopup>
      )}

      {/* 댓글 팝업 */}
      <CommentPopup
        open={openCmt}
        onClose={() => setOpenCmt(false)}
        value={cText}
        onChange={setCText}
        onSave={saveComment}
      />
    </div>
  );
}
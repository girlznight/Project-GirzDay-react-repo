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

  // 로컬스토리지 userId를 state로 관리
  const [myId, setMyId] = useState(
    Number(localStorage.getItem("userId") || 0)
  );

  const [showSide , setShowSide] = useState(false);
  const [notes    , setNotes]    = useState([]);
  const [images   , setImages]   = useState([]);
  const [copied   , setCopied]   = useState(false);
  const [openCmt  , setOpenCmt]  = useState(false);
  const [cText    , setCText]    = useState("");
  const [ownerId  , setOwnerId]  = useState(null);

  const sideRef = useRef(null);
  const isOwner = ownerId === myId;

  useEffect(() => {
    fetch(`http://localhost:5000/post/${id}`)
      .then(r => r.json()).then(p => setOwnerId(Number(p.userId)));

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

  async function delPost() {
    if (!window.confirm("삭제할까요?")) return;
    await fetch(`http://localhost:5000/post/${id}`, { method:"DELETE" });
    const latest = await fetch("http://localhost:5000/post?_sort=id&_order=desc")
                         .then(r=>r.json()).then(ls=>ls[0]);
    nav(`/post/${latest?.id || "create"}`);
  }

  // 🛠 수정: 화면 전환 없이 로그아웃 상태로만 변경
  function handleLogout() {
    if (!window.confirm("로그아웃할까요?")) return;
    localStorage.removeItem("userId");
    setMyId(0);
  }

  function handleDragEnd({ active, delta }) {
    if (!delta) return;
    setNotes(prev => prev.map(tb => {
      if (tb.id !== active.id || !(isOwner && tb.userId===myId)) return tb;
      const up = { ...tb, x: tb.x+delta.x, y: tb.y+delta.y };
      fetch(`http://localhost:5000/textbox/${tb.id}`, {
        method:"PUT", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(up)
      });
      return up;
    }));
  }

  function saveComment() {
    if (!cText.trim()) return;
    const newTb = {
      id: crypto.randomUUID(), postId:id, userId:myId,
      content:cText, imgSrc:NoteBg, x:120, y:120, zIndex:60
    };
    fetch("http://localhost:5000/textbox", {
      method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(newTb)
    }).then(()=> setNotes(n=>[...n,newTb]));
    setOpenCmt(false); setCText("");
  }

  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4">
      <button
        onClick={handleLogout}
        className="fixed top-6 right-8 z-50 text-sm text-blue-600"
      >Logout</button>

      {!showSide && <SidebarToggleBtn onClick={()=>setShowSide(true)} />}
      {showSide && <div ref={sideRef}><Sidebar onClose={()=>setShowSide(false)} /></div>}

      <div className="relative w-full h-[70vh] min-h-[500px]">
        <DndContext onDragEnd={handleDragEnd}>
          {notes.map((tb,i)=>(
            <Drag key={tb.id} id={tb.id} position={{x:tb.x,y:tb.y}}>
              <div
                style={{
                  width:320, height:320,
                  background:`url(${tb.imgSrc||NoteBg}) center/cover`,
                  zIndex:tb.zIndex||i+1,
                  cursor: isOwner&&tb.userId===myId?"grab":"default"
                }}
                className="px-6 py-4 select-none whitespace-pre-wrap break-words"
              >
                {tb.content}
              </div>
            </Drag>
          ))}
        </DndContext>

        {images.map((img,i)=>(
          <img key={img.id} src={img.src} alt=""
               className="absolute object-contain pointer-events-none select-none"
               style={{
                 left:img.x, top:img.y,
                 width:img.width||200, height:img.height||200,
                 zIndex:img.zIndex||i+50
               }}/>
        ))}
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex gap-6">
        <button onClick={()=>setOpenCmt(true)}>
          <img src={CommentIcon} alt="" className="w-8 h-8" />
        </button>
        {!openCmt && (
          <>
            <button onClick={share}>
              <img src={ShareIcon} alt="" className="w-8 h-8" />
            </button>
            {isOwner && (
              <>
                <button onClick={goEdit}>
                  <img src={EditIcon} alt="" className="w-8 h-8" />
                </button>
                <button onClick={delPost}>
                  <img src={DeleteIcon} alt="" className="w-8 h-8" />
                </button>
              </>
            )}
          </>
        )}
      </div>

      {copied && (
        <AlertPopup onClose={()=>setCopied(false)}>
          <div className="px-6 py-4">링크가 복사되었습니다!</div>
        </AlertPopup>
      )}

      <CommentPopup
        open={openCmt}
        onClose={()=>setOpenCmt(false)}
        value={cText}
        onChange={setCText}
        onSave={saveComment}
      />
    </div>
  );
}
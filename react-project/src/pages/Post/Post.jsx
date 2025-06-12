import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams }      from "react-router-dom";

import Sidebar            from "../../components/SideBar";
import SidebarToggleBtn   from "../../components/SidebarToggleButton";
import AlertPopup         from "../../components/AlertPopup";
import CommentPopup       from "../../components/CommentPopup";

/* assets */
import CommentIcon  from "../../assets/post_comment.svg";
import ShareIcon    from "../../assets/post_share.svg";
import EditIcon     from "../../assets/sidebar_pencil.svg";
import DeleteIcon   from "../../assets/discardbutton_trash.svg";
import NoteBg       from "../../assets/sticky-note.png";

export default function Post() {
  const { id }  = useParams();
  const nav     = useNavigate();
  const isOwner = id === "me";                 // 테스트용: 내 글 모드

  /* ---------- state ---------- */
  const [showSide, setSide] = useState(false);
  const [notes,    setNotes]= useState([]);
  const [photos,   setPhotos]= useState([]);
  const [copied,   setCopy] = useState(false);

  const [cOpen, setCOpen] = useState(false);   // 댓글 팝업
  const [cText, setCText] = useState("");

  const toggleComment = () => setCOpen(p => !p);

  const sideRef  = useRef(null);
  const localUid = Number(localStorage.getItem("userId") || 0);

  /* ── 사이드바 외 클릭 닫기 ── */
  useEffect(()=>{
    const fn=e=>{
      if(sideRef.current && !sideRef.current.contains(e.target)) setSide(false);
    };
    document.addEventListener("mousedown",fn);
    return ()=>document.removeEventListener("mousedown",fn);
  },[]);

  /* ── DB 로드 ── */
  useEffect(()=>{
    fetch(`http://localhost:5000/textbox?postId=${id}`)
      .then(r=>r.json()).then(setNotes);
    fetch(`http://localhost:5000/image?postId=${id}`)
      .then(r=>r.json()).then(setPhotos);
  },[id]);

  /* ── 공유 ── */
  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopy(true);
    setTimeout(()=>setCopy(false),2000);
  };

  /* ── 수정·삭제 (내 글) ── */
  const goEdit = () => nav(`/post/edit/${id}`);
  const delPost = async () => {
    if(!window.confirm("삭제할까요?")) return;
    await fetch(`http://localhost:5000/post/${id}`,{method:"DELETE"});
    const latest=await fetch("http://localhost:5000/post?_sort=createdAt&_order=desc")
                  .then(r=>r.json());
    nav(`/post/${latest[0]?.id || "1"}`);
  };

  /* ── 포스트잇 드래그 저장 ── */
  const dragEnd = (e,t) => {
    if(!isOwner || t.userId!==localUid) return;
    const up={...t,x:e.pageX-160,y:e.pageY-80};
    fetch(`http://localhost:5000/textbox/${t.id}`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(up)
    });
    setNotes(n=>n.map(x=>x.id===t.id?up:x));
  };

  /* ── 댓글 저장 ── */
  const writeCmt = () => {
    if(!cText.trim()) return;
    const newTb={
      id:crypto.randomUUID(),
      postId:id, userId:localUid,
      content:cText, imgSrc:NoteBg,
      x:120, y:120, zIndex:60
    };
    fetch("http://localhost:5000/textbox",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(newTb)
    });
    setNotes(n=>[...n,newTb]);
    setCText(""); setCOpen(false);
  };

  /* ---------- JSX ---------- */
  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4 overflow-hidden">

      {/* 댓글 팝업 오버레이 */}
      {cOpen && <div className="fixed inset-0 bg-[#fcfcf8]/60 z-40" />}

      {/* 로그아웃 (예시) */}
      <a href="/logout" className="fixed top-6 right-8 z-50 text-sm text-blue-600">
        Logout
      </a>

      {/* 사이드바 토글 */}
      {!showSide && <SidebarToggleBtn onClick={()=>setSide(true)} />}
      {showSide && <div ref={sideRef}><Sidebar/></div>}

      {/* 게시글 보드 */}
      <div className="relative w-full h-[70vh]" style={{minHeight:500}}>
        {notes.map((n,i)=>(
          <div key={n.id}
            draggable={isOwner && n.userId===localUid}
            onDragEnd={e=>dragEnd(e,n)}
            className="absolute px-6 py-4 select-none"
            style={{
              left:n.x, top:n.y,
              width:320, height:320,
              zIndex:n.zIndex||i+1,
              background:`url(${n.imgSrc||NoteBg}) center/cover no-repeat`,
              cursor:(isOwner && n.userId===localUid)?"move":"default",
              whiteSpace:"pre-wrap", wordBreak:"break-word", color:"#000"
            }}>
            {n.content}
          </div>
        ))}
        {photos.filter(p=>p.src && p.src.trim()!=="").map((p,i)=>(
          <img key={p.id} src={p.src} alt=""
               className="absolute object-contain pointer-events-none select-none"
               style={{
                 left:p.x, top:p.y,
                 width:p.width||250, height:p.height||250,
                 zIndex:p.zIndex||i+50
               }}/>
        ))}
      </div>

      {/* 하단 아이콘 ─ Comment → Share → (Edit·Delete) */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-6">
        <button onClick={toggleComment}>
          <img src={CommentIcon} className="w-8 h-8" alt="comment"/>
        </button>

        <button onClick={share} style={{visibility:cOpen?"hidden":"visible"}}>
          <img src={ShareIcon} className="w-8 h-8" alt="share"/>
        </button>

        {isOwner && (
          <>
            <button onClick={goEdit}>
              <img src={EditIcon} className="w-8 h-8" alt="edit"/>
            </button>
            <button onClick={delPost}>
              <img src={DeleteIcon} className="w-8 h-8" alt="delete"/>
            </button>
          </>
        )}
      </div>

      {/* 공유 알림 */}
      {copied && (
        <AlertPopup onClose={()=>setCopy(false)}>
          <div className="px-6 py-4 text-sm">링크가 복사되었습니다!</div>
        </AlertPopup>
      )}

      {/* 댓글 팝업 */}
      <CommentPopup
        open={cOpen}
        onClose={()=>setCOpen(false)}
        value={cText}
        onChange={setCText}
        onSave={writeCmt}
      />
    </div>
  );
}
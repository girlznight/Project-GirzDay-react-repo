import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams }      from "react-router-dom";

import Sidebar            from "../../components/SideBar";
import SidebarToggleBtn   from "../../components/SidebarToggleButton";
import AlertPopup         from "../../components/AlertPopup";

/* 아이콘 & 포스트잇 배경 (src/assets) */
import CommentIcon from "../../assets/post_comment.svg";
import ShareIcon   from "../../assets/post_share.svg";
import EditIcon    from "../../assets/sidebar_pencil.svg";
import DeleteIcon  from "../../assets/discardbutton_trash.svg";
import NoteBg      from "../../assets/sticky-note.png";     // 공통 포스트잇 배경

export default function Post() {
  const { id }  = useParams();          // "me" = 내 글
  const nav     = useNavigate();
  const isOwner = id === "me";

  const [showSide, setSide] = useState(false);
  const [notes,    setNotes]= useState([]);   // 텍스트 포스트잇
  const [photos,   setPhotos]= useState([]);  // 일반 이미지
  const [copied,   setCopy] = useState(false);
  const [cOpen,    setOpen] = useState(false);
  const [cText,    setText] = useState("");
  const sideRef               = useRef(null);
  const localUid = Number(localStorage.getItem("userId") || 0);

  /* 사이드바 외부 클릭 시 닫기 */
  useEffect(() => {
    const out = e => { if (sideRef.current && !sideRef.current.contains(e.target)) setSide(false); };
    document.addEventListener("mousedown", out);
    return () => document.removeEventListener("mousedown", out);
  }, []);

  /* DB 로드 */
  useEffect(() => {
    fetch(`http://localhost:5000/textbox?postId=${id}`).then(r=>r.json()).then(setNotes);
    fetch(`http://localhost:5000/image?postId=${id}`).then(r=>r.json()).then(setPhotos);
  }, [id]);

  /* 공유 */
  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopy(true); setTimeout(()=>setCopy(false), 2000);
  };

  /* 수정·삭제 (내 글) */
  const editPost = () => nav(`/post/edit/${id}`);
  const delPost  = async () => {
    if (!window.confirm("삭제할까요?")) return;
    await fetch(`http://localhost:5000/post/${id}`, { method:"DELETE"});
    const latest = await fetch("http://localhost:5000/post?_sort=createdAt&_order=desc")
                         .then(r=>r.json());
    nav(`/post/${latest[0]?.id || "1"}`);
  };

  /* 드래그 저장 */
  const dragSave = (e,t) => {
    if (!isOwner || t.userId!==localUid) return;
    const nx=e.pageX-160, ny=e.pageY-80;
    const up={...t,x:nx,y:ny};
    fetch(`http://localhost:5000/textbox/${t.id}`,{
      method:"PUT", headers:{ "Content-Type":"application/json"}, body:JSON.stringify(up)
    });
    setNotes(n=>n.map(x=>x.id===t.id? up:x));
  };

  /* 댓글 작성 */
  const writeCmt = () => {
    if (!cText.trim()) return;
    const newNote = {
      id:crypto.randomUUID(), postId:id, userId:localUid,
      type:"text", content:cText, imgSrc:NoteBg, x:120, y:120, zIndex:60
    };
    fetch("http://localhost:5000/textbox",{
      method:"POST", headers:{ "Content-Type":"application/json"}, body:JSON.stringify(newNote)
    });
    setNotes(n=>[...n,newNote]); setText(""); setOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4 overflow-hidden">

      {/* 로그아웃 링크(예시) */}
      <a href="/logout" className="fixed top-6 right-8 z-50 text-sm text-blue-600">Logout</a>

      {/* 사이드바 토글 */}
      {!showSide && <SidebarToggleBtn onClick={()=>setSide(true)} />}
      {showSide && <div ref={sideRef}><Sidebar/></div>}

      {/* 보드 */}
      <div className="relative w-full h-[70vh]" style={{ minHeight:500 }}>
        {/* 텍스트 포스트잇 */}
        {notes.map((tb,i)=>(
          <div key={tb.id}
            draggable={isOwner && tb.userId===localUid}
            onDragEnd={e=>dragSave(e,tb)}
            className="absolute px-6 py-4 select-none"
            style={{
              left:tb.x, top:tb.y, width:320, height:320, zIndex:tb.zIndex||i+1,
              background:`url(${tb.imgSrc||NoteBg}) center/cover no-repeat`,
              cursor:(isOwner && tb.userId===localUid)? "move":"default",
              whiteSpace:"pre-wrap", wordBreak:"break-word", color:"#000"
            }}>{tb.content}</div>
        ))}

        {/* 일반 이미지 (로드 실패 시 숨김 처리만) */}
        {photos.map((ph,i)=>(
          <img key={ph.id}
            src={ph.src}      /* ph.src 를 그대로 사용 */
            alt=""
            onError={e => { e.currentTarget.style.display = "none"; }} /* 깨지면 숨김 */
            className="absolute object-contain rounded pointer-events-none select-none"
            style={{
              left:ph.x, top:ph.y,
              width:ph.width||250, height:ph.height||250,
              zIndex:ph.zIndex||i+50
            }}/>
        ))}
      </div>

      {/* 오른쪽 하단 아이콘 */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-6">
        <button onClick={()=>setOpen(true)}><img src={CommentIcon} alt="" className="w-8 h-8"/></button>
        <button onClick={share}            ><img src={ShareIcon}   alt="" className="w-8 h-8"/></button>
        {isOwner && (
          <>
            <button onClick={editPost}><img src={EditIcon}   alt="" className="w-8 h-8"/></button>
            <button onClick={delPost} ><img src={DeleteIcon} alt="" className="w-8 h-8"/></button>
          </>
        )}
      </div>

      {/* 공유 완료 알림 */}
      {copied && (
        <AlertPopup onClose={()=>setCopy(false)}>
          <div className="px-6 py-4 text-sm">링크가 복사되었습니다!</div>
        </AlertPopup>
      )}

      {/* 댓글 입력 포스트잇 */}
      {cOpen && (
        <AlertPopup onClose={()=>setOpen(false)}>
          <div className="relative w-[380px] h-[380px] p-6"
               style={{ background:`url(${NoteBg}) center/cover no-repeat` }}>
            <textarea
              className="w-full h-full bg-transparent outline-none resize-none"
              placeholder="코멘트를 남겨주세요…"
              value={cText}
              onChange={e=>setText(e.target.value)}
            />
            <button onClick={writeCmt}
                    className="absolute bottom-4 right-4 text-2xl leading-none">✔︎</button>
          </div>
        </AlertPopup>
      )}
    </div>
  );
}
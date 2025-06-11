import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams }      from "react-router-dom";

import Sidebar            from "../../components/SideBar";
import SidebarToggleBtn   from "../../components/SidebarToggleButton";
import AlertPopup         from "../../components/AlertPopup";

/* ───── 이미지 / 아이콘 (src/assets 폴더) ───── */
import CommentIcon  from "../../assets/post_comment.svg";
import ShareIcon    from "../../assets/post_share.svg";
import EditIcon     from "../../assets/sidebar_pencil.svg";
import DeleteIcon   from "../../assets/discardbutton_trash.svg";

import NoteBg       from "../../assets/sticky-note.png";   // 기본 포스트잇 배경
import CommentBg    from "../../assets/sticky-note.png";    // 댓글 포스트잇 배경

export default function Post() {
  /* ───── 라우팅 & 모드 ───── */
  const { id }   = useParams();           // "me" → 내 글, 그 외 → 읽기 전용
  const nav      = useNavigate();
  const isOwner  = id === "me";           // (테스트용 조건)

  /* ───── UI 상태 ───── */
  const [showSide,  setSide]  = useState(false);
  const [notes,     setNotes] = useState([]);   // 포스트잇(textbox)
  const [photos,    setPhotos]= useState([]);   // 일반 이미지
  const [copied,    setCopy]  = useState(false);
  const [cOpen,     setCOpen] = useState(false);
  const [cText,     setCText] = useState("");
  const sideRef                 = useRef(null);

  const localUid = Number(localStorage.getItem("userId") || 0);

  /* ───── 사이드바 바깥 클릭시 닫기 ───── */
  useEffect(() => {
    const out = e => { if (sideRef.current && !sideRef.current.contains(e.target)) setSide(false); };
    document.addEventListener("mousedown", out);
    return () => document.removeEventListener("mousedown", out);
  }, []);

  /* ───── DB 데이터 로딩 ───── */
  useEffect(() => {
    fetch(`http://localhost:5000/textbox?postId=${id}`).then(r=>r.json()).then(setNotes);
    fetch(`http://localhost:5000/image?postId=${id}`)  .then(r=>r.json()).then(setPhotos);
  }, [id]);

  /* ───── 공유 ───── */
  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopy(true);
    setTimeout(()=>setCopy(false), 2000);
  };

  /* ───── 수정 · 삭제 (내 글) ───── */
  const goEdit = () => nav(`/post/edit/${id}`);
  const delPost= async () => {
    if (!window.confirm("삭제할까요?")) return;
    await fetch(`http://localhost:5000/post/${id}`, { method:"DELETE"});
    const latest = await fetch("http://localhost:5000/post?_sort=createdAt&_order=desc").then(r=>r.json());
    nav(`/post/${latest[0]?.id || "1"}`);
  };

  /* ───── 드래그 저장 ───── */
  const dragEnd = (e,t) => {
    if (!isOwner || t.userId !== localUid) return;
    const nx=e.pageX-160, ny=e.pageY-80;
    const updated={...t,x:nx,y:ny};
    fetch(`http://localhost:5000/textbox/${t.id}`,{
      method:"PUT",headers:{ "Content-Type":"application/json"},body:JSON.stringify(updated)
    });
    setNotes(p=>p.map(n=>n.id===t.id?updated:n));
  };

  /* ───── 댓글 작성 ───── */
  const writeCmt = () => {
    if (!cText.trim()) return;
    const newNote = {
      id:crypto.randomUUID(), postId:id, userId:localUid,
      type:"text", content:cText, imgSrc:CommentBg,
      x:120, y:120, zIndex:60
    };
    fetch("http://localhost:5000/textbox",{method:"POST",headers:{ "Content-Type":"application/json"},body:JSON.stringify(newNote)});
    setNotes(n=>[...n,newNote]);
    setCText(""); setCOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4 overflow-hidden">
      {/* 로그아웃 링크(예시) */}
      <a href="/logout" className="fixed top-6 right-8 z-50 text-sm text-blue-600">Logout</a>

      {/* 사이드바 토글 */}
      {!showSide && <SidebarToggleBtn onClick={()=>setSide(true)} />}
      {showSide && <div ref={sideRef}><Sidebar/></div>}

      {/* 보드 ─ 포스트잇 + 이미지 */}
      <div className="relative w-full h-[70vh]" style={{ minHeight:500 }}>
        {notes.map((n,i)=>(
          <div key={n.id}
            draggable={isOwner && n.userId===localUid}
            onDragEnd={e=>dragEnd(e,n)}
            className="absolute px-6 py-4 select-none"
            style={{
              left:n.x, top:n.y, width:320, height:320, zIndex:n.zIndex||i+1,
              background:`url(${n.imgSrc||NoteBg}) center/cover no-repeat`,
              cursor:(isOwner && n.userId===localUid)?"move":"default",
              whiteSpace:"pre-wrap", wordBreak:"break-word", color:"#000"
            }}>{n.content}</div>
        ))}

        {photos.map((p,i)=>(
          <img key={p.id} src={p.src} alt=""
            className="absolute object-contain rounded pointer-events-none select-none"
            style={{ left:p.x, top:p.y, width:p.width||250, height:p.height||250, zIndex:p.zIndex||i+50 }}/>
        ))}
      </div>

      {/* 오른쪽 하단 아이콘 */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-6">
        <button onClick={()=>setCOpen(true)} ><img src={CommentIcon} className="w-8 h-8"/></button>
        <button onClick={share}              ><img src={ShareIcon}   className="w-8 h-8"/></button>
        {isOwner && (
          <>
            <button onClick={goEdit}><img src={EditIcon}   className="w-8 h-8"/></button>
            <button onClick={delPost}><img src={DeleteIcon}className="w-8 h-8"/></button>
          </>
        )}
      </div>

      {/* 공유 완료 팝업 */}
      {copied && (
        <AlertPopup onClose={()=>setCopy(false)}>
          <div className="px-6 py-4 text-sm">링크가 복사되었습니다!</div>
        </AlertPopup>
      )}

      {/* 댓글 입력 포스트잇 */}
      {cOpen && (
        <AlertPopup onClose={()=>setCOpen(false)}>
          <div className="relative w-[380px] h-[380px] p-6"
               style={{ background:`url(${NoteBg}) center/cover no-repeat` }}>
            <textarea
              className="w-full h-full bg-transparent outline-none resize-none"
              placeholder="코멘트를 남겨주세요…"
              value={cText}
              onChange={e=>setCText(e.target.value)}
            />
            <button onClick={writeCmt}
                    className="absolute bottom-4 right-4 text-2xl leading-none">✔︎</button>
          </div>
        </AlertPopup>
      )}
    </div>
  );
}
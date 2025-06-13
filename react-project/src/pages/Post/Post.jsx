// 전부 챗지피티
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
  const { id }    = useParams();
  const nav       = useNavigate();
  const myId      = Number(localStorage.getItem("userId") || 0);

  const [showSide       , setShowSide      ] = useState(false);
  const [textboxes      , setTextboxes     ] = useState([]);
  const [images         , setImages        ] = useState([]);
  const [postits        , setPostits       ] = useState([]);
  const [showShareAlert , setShowShareAlert] = useState(false);
  const [openCmt        , setOpenCmt       ] = useState(false);
  const [commentText    , setCommentText   ] = useState("");
  const [ownerId        , setOwnerId       ] = useState(null);
  const [showAlert      , setShowAlert     ] = useState(false);

  const sidebarRef = useRef(null);
  const isOwner    = ownerId === myId;

  useEffect(() => {
    fetch(`http://localhost:5000/post/${id}`)
      .then(r => r.json()).then(p => setOwnerId(Number(p.userId)));
    fetch(`http://localhost:5000/textbox?postId=${id}`)
      .then(r => r.json()).then(setTextboxes);
    fetch(`http://localhost:5000/image?postId=${id}`)
      .then(r => r.json()).then(setImages);
    fetch(`http://localhost:5000/postit?postId=${id}`)
      .then(r => r.json()).then(setPostits);
  }, [id]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSide(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function onShareClick() {
    setShowShareAlert(true);
  }
  function handleShareYes() {
    setShowShareAlert(false);
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        window.alert("링크가 복사되었습니다!");
      })
      .catch(() => {
        window.alert("클립보드 복사에 실패했습니다.");
      });
  }
  function handleShareNo() {
    setShowShareAlert(false);
  }

  function goEdit()  { nav(`/post/edit/${id}`); }
  function handleLogout() {
    localStorage.removeItem("userId");
  }

  async function handleAlertYes() {
    const delTb  = textboxes.map(tb  =>
      fetch(`http://localhost:5000/textbox/${tb.id}`, { method:"DELETE" })
    );
    const delImg = images.map(img =>
      fetch(`http://localhost:5000/image/${img.id}`, { method:"DELETE" })
    );
    const delPt  = postits.map(pt =>
      fetch(`http://localhost:5000/postit/${pt.id}`, { method:"DELETE" })
    );
    await Promise.all([...delTb, ...delImg, ...delPt]);
    await fetch(`http://localhost:5000/post/${id}`, { method:"DELETE" });
    setShowAlert(false);
    setTimeout(async () => {
      alert("삭제되었습니다!");
      const latest = await fetch("http://localhost:5000/post?_sort=id&_order=desc")
                            .then(r=>r.json()).then(ls=>ls[0]);
      nav(`/post/${latest?.id || "create"}`);
    }, 200);
  }
  function handleAlertNo() { setShowAlert(false); }
  function onDiscard()      { setShowAlert(true); }

  function handleDragEnd({ active, delta }) {
    if (!delta) return;
    const activeId = String(active.id);
    setPostits(prev =>
      prev.map(pt => {
        if (String(pt.id) !== activeId) return pt;
        const updated = { ...pt, x: pt.x + delta.x, y: pt.y + delta.y };
        if (isOwner) {
          fetch(`http://localhost:5000/postit/${pt.id}`, {
            method:"PUT",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify(updated)
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
      postId:id,
      userId:myId,
      content:commentText,
      imgSrc:NoteBg,
      x:120, y:120, zIndex:60
    };
    fetch("http://localhost:5000/postit", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
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

      {!showSide && <SidebarToggleBtn onClick={()=>setShowSide(true)}/>}
      {showSide && <div ref={sidebarRef}><Sidebar onClose={()=>setShowSide(false)}/></div>}

      <div className="relative w-full h-[90vh] overflow-hidden">
        <DndContext onDragEnd={handleDragEnd}>
          {textboxes.map((tb,i)=>(
            <div
              key={tb.id}
              style={{
                position:"absolute",
                left:tb.x, top:tb.y,
                zIndex:tb.zIndex||i+1,
                maxWidth:320, whiteSpace:"pre-wrap"
              }}
              className="text-base text-black"
            >
              {tb.content}
            </div>
          ))}

          {postits.map((pt,i)=>(
            <Drag key={pt.id} id={pt.id} position={{x:pt.x,y:pt.y}}>
              <div
                style={{
                  width:220, height:220,
                  backgroundImage:`url(${pt.imgSrc||NoteBg})`,
                  backgroundSize:"cover", backgroundPosition:"center",
                  zIndex:pt.zIndex||i+100,
                  cursor:isOwner?"grab":"default",
                  padding:"1.2rem", display:"flex",
                  alignItems:"flex-start", justifyContent:"flex-start",
                  whiteSpace:"pre-wrap", wordBreak:"break-word",
                  outline:"none"
                }}
                className="select-none text-base text-black"
              >
                {pt.content}
              </div>
            </Drag>
          ))}

          {images.map((img,i)=>(
            <div
              key={img.id}
              style={{
                position:"absolute",
                left:img.x, top:img.y,
                width:img.width||200, height:img.height||200,
                zIndex:img.zIndex||i+50
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
        <button onClick={()=>setOpenCmt(true)}>
          <img src={CommentIcon} alt="comment" className="w-8 h-8"/>
        </button>
        {!openCmt && (
          <>
            <button onClick={onShareClick}>
              <img src={ShareIcon} alt="share" className="w-8 h-8"/>
            </button>
            {isOwner && (
              <>
                <button onClick={goEdit}>
                  <img src={EditIcon} alt="edit" className="w-8 h-8"/>
                </button>
                <button onClick={onDiscard}>
                  <img src={DeleteIcon} alt="delete" className="w-8 h-8"/>
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
        onClose={()=>setOpenCmt(false)}
        value={commentText}
        onChange={setCommentText}
        onSave={saveComment}
      />
    </div>
  );
}
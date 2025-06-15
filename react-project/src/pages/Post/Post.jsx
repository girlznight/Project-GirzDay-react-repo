import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Sidebar from "../../components/SideBar";
import SidebarToggleBtn from "../../components/SidebarToggleButton";
import AlertPopup from "../../components/AlertPopup";
import CommentPopup from "../../components/CommentPopup";
import CommentEditPopup from "../../components/CommentEditPopup";
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
// DndContext는 dnd-kit 라이브러리에서 제공하는 컴포넌트로, drag n drop 기능 활성화 함
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

  const [hoverId, setHoverId] = useState(null); // 현재 마우스 올린 Post it의 ID (... 버튼 노출 제어용)
  const [editingId, setEditingId] = useState(null); // 편집 중인 Post it의 ID (어떤 post it을 수정할지)
  const [draftText, setDraftText] = useState(""); // CommentEditPopup 안에 입력 중인 텍스트

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
      // 사이드바 외부 클릭 시 닫기
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSide(false);
      }
      if (!e.target.closest(".postit-wrapper")) {
        // postit-wrapper 외부 클릭 시 ... 버튼 숨기기
        setHoverId(null);
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
    // 텍스트박스 delete 요청
    const delTb = textboxes.map(tb =>
      fetch(`http://localhost:5000/textbox/${tb.id}`, { method: "DELETE" })
    );
    // 이미지 delete 요청
    const delImg = images.map(img =>
      fetch(`http://localhost:5000/image/${img.id}`, { method: "DELETE" })
    );
    // 포스트잇 delete 요청
    const delPt = postits.map(pt =>
      fetch(`http://localhost:5000/postit/${pt.id}`, { method: "DELETE" })
    );
    // 요청이 끝날 때까지 기다리기
    await Promise.all([...delTb, ...delImg, ...delPt]);
    // post delete 요청
    await fetch(`http://localhost:5000/post/${id}`, { method: "DELETE" });
    setShowAlert(false); // 삭제 확인 팝업 닫기
    // 200ms 뒤 실행
    setTimeout(async () => {
      alert("삭제되었습니다!");
      // 가장 최신 post 가져오기
      const latest = await fetch("http://localhost:5000/post?_sort=id&_order=desc")
        .then(r => r.json())
        .then(ls => ls[0]);
      // 가장 최신 post 가져오기, 없으면 PostCreate로
      nav(`/post/${latest?.id || "create"}`);
    }, 200);
  }
  function handleAlertNo() { setShowAlert(false); } // 팝업 닫기
  function onDiscard() { setShowAlert(true); } // 팝업 열기

  // 드래그 종료 위치 업데이트 (dnd-kit 사용) & 저장
  function handleDragEnd({ active, delta }) { // active: 현재 드래그 중인 포스트잇, delta: x, y 변화(드래그 이동 거리)
    if (!delta) return; // delta가 없으면 return nothing
    const activeId = String(active.id); // 드래그한 포스트잇 id 문자열로 저장
    setPostits(prev => // 포스트잇 목록 업데이트
      prev.map(pt => { // post-it 배열 순회하며 하나씩 확인
        if (String(pt.id) !== activeId) return pt; // pt의 id가 activeId와 다르면 그대로(pt) 반환
        const updated = { ...pt, x: pt.x + delta.x, y: pt.y + delta.y }; // 변환된 x, y(delta)값을 더함
        if (isOwner) {
          fetch(`http://localhost:5000/postit/${pt.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
          }); // 현재 사용자가 포스트의 작성자이면 (isOwner) 변경된 포스트잇 정보 서버에 저장
        }
        return updated; // 변경된 포스트잇 반환
      })
    );
  }

  // 포스트잇 내용 저장
  function saveComment() {
    if (!commentText.trim()) return; // comment 내용이 공백(trim)이면 종료(nothing)
    const nc = { // new comment
      id: crypto.randomUUID(), // cryptographically(암호적으로) secure, random UUID (Universally Unique Identifier) -> 랜덤으로 고유한 식별자(Id) 만들어줌
      postId: id,
      userId: myId,
      content: commentText,
      imgSrc: NoteBg,
      x: 120, y: 120, zIndex: 60 // 포스트잇 위치와 레이어(z-index) 순서
    };
    fetch("http://localhost:5000/postit", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // 데이터형식을 json으로 지정
      body: JSON.stringify(nc) // 만들어진 포스트잇을 json으로 변환
    }).then(() => setPostits(p => [...p, nc])); // 저장이 완료되면, nc(new comment)를 화면의 포스트잇 목록에 추가
    setOpenCmt(false); // CommentPopup 닫기
    setCommentText(""); // comment 내용 비우기
  }

  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4">
      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="fixed top-6 right-8 z-50 text-sm text-blue-600"
      >
        Logout
      </button>

      {/* showSide가 false이면 sidebar toggle button이 보이기, 클릭 시사이드바 열기 */}
      {!showSide && <SidebarToggleBtn onClick={() => setShowSide(true)} />}
      {/* showSide가 true이면 sidebar 보이기, sidebar에서 닫기 버튼을 누르면사이드바 닫기 */}
      {showSide && <div ref={sidebarRef}><Sidebar onClose={() => setShowSide(false)} /></div>}

      <div className="relative w-full h-[90vh] overflow-hidden">
        {/* DndContext로 drag and drop 기능 활성화 */}
        <DndContext onDragEnd={handleDragEnd}>
          {/* 텍스트박스 */}
          {textboxes.map((tb, i) => ( // textbox 배열 순회하며 textbox, index 받아서 렌더링
            <div
              key={tb.id}
              style={{
                position: "absolute",
                left: tb.x, top: tb.y,
                zIndex: tb.zIndex ?? i + 1, // z 인덱스, 없으면 index + 1로 설정
                maxWidth: 320, whiteSpace: "pre-wrap" // whiteSpace: 줄 바꿈 & 공백 보존
              }}
              className="text-base text-black"
            >
              {/* textbox의 content 출력 */}
              {tb.content}
            </div>
          ))}

          {/* 포스트잇 */}
          {postits.map((pt, i) => ( // 포스트잇 배열을 순회하며 렌더링
            <Drag key={pt.id} id={pt.id} position={{ x: pt.x, y: pt.y }}>
              <div
                style={{
                  backgroundImage: `url(${NoteBg})`, // 포스트잇 배경 이미지
                  backgroundSize: "cover", // 배경 이미지 꽉 채우기
                  backgroundPosition: "center",  // 배경 이미지 중앙 정렬
                  zIndex: pt.zIndex ?? i + 100, // z 인덱스, 없으면 index + 100으로 설정
                  cursor: isOwner ? "grab" : "default", // 현재 사용자가 포스트잇 작성자이면 cursor를 grab으로 변경, 아니면 default
                  padding: "1.2rem", // 내부 여백
                  display: "flex", // flex 레이아웃 사용
                  alignItems: "flex-start", justifyContent: "flex-start", // 세로축, 가로축 왼쪽 정렬
                  whiteSpace: "pre-wrap", // 줄바꿈&공백 그대로 유지(자동 줄바꿈)
                  wordBreak: "break-word", // 단어가 길어서 넘치면 단어 중간에서 줄바꿈
                  outline: "none"  // focus 받았을 때 외곽선 나타나지 않음
                }}
                className="select-none text-sm xl:text-base 2xl:text-lg text-black w-[160px] h-[160px] xl:w-[180px] xl:h-[180px] 2xl:w-[190px] 2xl:h-[190px] transition-all duration-300"
                        // 텍스트 선택(드래그) 불가
                        //  글자 크기 : small, xl(1280px 이상): base, 2xl(1536px이상): large
                        // w, h : 너비, 높이 지정
                        // 트랜지션(애니메이션) 효과 적용, 지속시간 300ms

                onMouseEnter={() => pt.userId === myId && setHoverId(pt.id)}  /* 마우스 커서가 내가 쓴 post it 위에 올려졌을 때만 hover 시작 */
                onMouseLeave={() => pt.userId === myId && setHoverId(null)}  /* 마우스 커서가 내가 쓴 post it을 벗어나면 hover 끝 */
              >
                {/* 포스트잇 내용 출력 */}
                {pt.content}

                {/* 마우스 커서가 내가 쓴 post it 위에 올려졌을 때만 나타나는 옵션(...) 버튼 */}
                {hoverId === pt.id && ( // hoverId가 현재 순회 중인 pt.id와 같을 때만 버튼 표시
                  <button
                    className="absolute top-1 right-3 pointer-events-auto"
                    onPointerDown={e => {
                      e.stopPropagation();    // 부모(Drag 컴포넌트)로 전파되는 걸 차단
                      e.preventDefault();     // 기본 드래그 동작 차단
                    }}
                    onClick={() => {
                      setEditingId(pt.id);       /* 어떤 포스트잇을 편집할지 ID를 기억 */
                      setDraftText(pt.content);  /* 편집 팝업 안의 textarea에 원래 내용을 채워 넣음 */
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
            <div
              key={img.id}
              style={{
                position: "absolute",
                left: img.x, top: img.y,
                width: img.width || 200, height: img.height || 200,
                zIndex: img.zIndex ?? i + 50 // z 인덱스, 없으면 index + 50으로 설정
              }}
              className="select-none pointer-events-none"
            >
              <img
                src={img.src} alt=""
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
                {/* !!alert popup이 뜨는가..? 뭐 뜨는지 확인하기!! */}
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
      {showAlert && (
        <AlertPopup
          show={showAlert}
          message="정말로 삭제하시겠습니까?"
          onYes={handleAlertYes} // Yes 클릭 시 호출
          onNo={handleAlertNo} // No 클릭 시 호출
        />
      )}

      {/* 댓글 팝업 */}
      <CommentPopup
        open={openCmt} // popup 상태 관리 true->열림, false->닫힘
        onClose={() => setOpenCmt(false)} // popup 닫기
        value={commentText} // comment 입력창 현재 상태
        onChange={setCommentText} // 입력창에 글 쓸 때마다 commentText 업데이트
        onSave={saveComment} // save btn 클릭 -> comment contents save
      />

      {/* 편집 팝업: CommentEditPopup */}
      <CommentEditPopup
        open={editingId !== null} // 편집 팝업 열지 말지 결정 (editingId가 null이 아니면 열기)
        value={draftText} // 팝업 textarea에 표시할 텍스트
        onChange={setDraftText} // textarea 변경 시 draftText 업데이트
        onClose={() => setEditingId(null)} // × 클릭 시 편집 모드 종료
        onSave={() => { // ✓ 버튼 클릭 시 서버에 PUT, 로컬 상태 업데이트
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
          fetch(`http://localhost:5000/postit/${editingId}`, {
            method: "DELETE" // DELETE 메서드 사용
          }).then(() => {
            setPostits(ps => ps.filter(p => p.id !== editingId)); // 해당 post it만 필터링
            setEditingId(null); // 편집 모드 종료
          });
        }}
      />
    </div>
  );
}
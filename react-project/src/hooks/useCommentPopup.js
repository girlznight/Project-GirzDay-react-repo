// 포스트잇 내용 저장
export function saveComment({
  commentText,
  setPostits,
  postits,
  myId,
  setOpenCmt,
  setCommentText,
  NoteBg,
  postId,
}) {
  if (!commentText.trim()) return; // comment 내용이 공백이면 저장 안 함

  const maxZ = postits.reduce((max, p) => Math.max(max, p.zIndex), 0); // 가장 위에 있는 레이어 zIndex

  const nc = {
    postId: Number(postId), // 현재 게시글 ID
    userId: myId, // 로그인한 사용자 ID
    content: commentText, // 입력 내용
    imgSrc: NoteBg, // 배경 이미지
    x: 120, y: 120, // 포스트잇 위치
    zIndex: maxZ + 1 // 레이어(z-index) 순서
  };

  fetch("http://localhost:5000/postit", {
    method: "POST", // Post 메서드 사용
    headers: { "Content-Type": "application/json" },// 데이터형식을 json으로 지정
    body: JSON.stringify(nc) // 만들어진 포스트잇을 json으로 변환
  })
    .then(res => res.json())                   // 서버가 생성한 id를 포함한 저장된 객체 받기
    .then(saved => setPostits(p => [...p, saved])); // 저장이 완료되면, nc(new comment)를 화면의 포스트잇 목록에 추가

  setOpenCmt(false); // CommentPopup 닫기
  setCommentText(""); // comment 내용 비우기
}
// 삭제 요청
// async -> promise 반환 (비동기로 동작)
// await -> promise 완료될 때까지 기다리고 결과 반환
export async function handleAlertYes({ textboxes, images, postits, id, setShowAlert, nav }) {
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

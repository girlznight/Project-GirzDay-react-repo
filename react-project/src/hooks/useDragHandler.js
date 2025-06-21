// 드래그 종료 위치 업데이트 (dnd-kit 사용) & 저장
export function handleDragEnd({ active, delta }, myId, postits, setPostits) {
  // active: 현재 드래그 중인 포스트잇, delta: x, y 변화(드래그 이동 거리)
  if (!delta) return; // delta가 없으면 return nothing
  const activeId = String(active.id); // 드래그한 포스트잇 id 문자열로 저장

  setPostits(prev => // 포스트잇 목록 업데이트
    prev.map(pt => { // post-it 배열 순회하며 하나씩 확인
      if (String(pt.id) !== activeId) return pt; // pt의 id가 activeId와 다르면 그대로(pt) 반환
      
      const updated = { ...pt, x: pt.x + delta.x, y: pt.y + delta.y }; // 변환된 x, y(delta)값을 더함
      if (pt.userId === myId) {
        fetch(`http://localhost:5000/postit/${pt.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated) 
        }); // 현재 사용자가 포스트의 작성자이면 (isOwner) 변경된 포스트잇 정보 서버에 저장
      }
      return updated;
    })
  );
}
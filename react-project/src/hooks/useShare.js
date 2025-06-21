export function useShare(setShowShareAlert) {
  const onShareClick = () => setShowShareAlert(true); // 공유 팝업 열기

  // share 하기
  const handleShareYes = () => {
    setShowShareAlert(false);
    // 현재 페이지 url 복사
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert("링크가 복사되었습니다!")) // 복사 성공
      .catch(() => alert("클립보드 복사에 실패했습니다.")); // 복사 실패
  };

  const handleShareNo = () => // share 안 하기
    setShowShareAlert(false); // 공유 팝업 닫기

  return { onShareClick, handleShareYes, handleShareNo };
}

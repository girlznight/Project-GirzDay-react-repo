import { useState } from "react";

// 댓글 편집 팝업에서 사용하는 상태 및 함수들을 제공
export default function useEditPopup(initialText = "") {
  const [editingId, setEditingId] = useState(null);
  const [draftText, setDraftText] = useState(initialText);

  const openEditor = (id, content) => {
    setEditingId(id); /* 어떤 포스트잇을 편집할지 ID를 기억 */
    setDraftText(content); /* 편집 팝업 안의 textarea에 원래 내용을 채워 넣음 */
  }; 

  const closeEditor = () => setEditingId(null);

  return {
    editingId, // 현재 편집 중인 포스트잇의 ID
    draftText, // 편집 중인 텍스트 내용
    setDraftText, // 입력창 상태를 변경
    openEditor, // 편집 시작
    closeEditor, // 편집 종료
  };
}

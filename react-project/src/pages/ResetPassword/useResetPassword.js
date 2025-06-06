import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByLoginId, getAuthByLoginId, updatePassword } from "./resetPasswordApi";

// 비밀번호 재설정 기능
export default function useResetPassword() {
  const [loginId, setLoginId] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 버튼 누르면 실행될 함수 (비밀번호 재설정 시도)
  const handleResetPassword = async () => {
    if (!loginId || !newPw || !confirmPw) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    if (newPw.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 해요.");
      return;
    }

    if (newPw !== confirmPw) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

     const user = await getUserByLoginId(loginId);
    if (!user) {
      setError("존재하지 않는 ID입니다.");
      return;
    }

    const auth = await getAuthByLoginId(user.id);
    if (!auth) {
      setError("비밀번호 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      await updatePassword(auth.id, newPw);   // 중복 fetch 없이 바로 PATCH

      alert("비밀번호가 변경되었습니다!");
      navigate("/login");
    } catch (e) {
      setError("비밀번호 변경 중 오류가 발생했어요.");
    }
  };

  //이 훅을 사용하는 컴포넌트에 필요한 값들 넘겨줌
  return {
    loginId,
    setLoginId,
    newPw,
    setNewPw,
    confirmPw,
    setConfirmPw,
    error,
    handleResetPassword,
  };
}

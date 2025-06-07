import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByLoginId, getAuthByLoginId, updatePassword } from "./resetPasswordApi";

// 비밀번호 재설정 기능
export default function useResetPassword() {
  const [loginId, setLoginId] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState(""); // 어떤 필드에서 에러가 발생했는지 추적
  const navigate = useNavigate();

  // 에러 초기화 함수
  const clearError = () => {
    setError("");
    setErrorField("");
  };

  // 버튼 누르면 실행될 함수 (비밀번호 재설정 시도)
  const handleResetPassword = async () => {
    clearError(); // 기존 에러 초기화

    // 모든 항목 입력 확인
    if (!loginId || !newPw || !confirmPw) {
      setError("모든 항목을 입력해주세요.");
      setErrorField("all");
      return;
    }

    // 새 비밀번호 길이 확인
    if (newPw.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 해요.");
      setErrorField("newPw");
      return;
    }

    // 비밀번호 일치 확인 (이미지의 2번째 상황)
    if (newPw !== confirmPw) {
      setError("Password does not match"); // 이미지와 동일한 영문 메시지
      setErrorField("confirmPw"); // NEW PW와 Confirm NEW PW 모두 빨간 테두리
      return;
    }

    try {
      // ID 존재 확인 (이미지의 3번째 상황)
      const user = await getUserByLoginId(loginId);
      if (!user) {
        setError("This ID does not exist"); // 이미지와 동일한 영문 메시지
        setErrorField("id"); // ID만 빨간 테두리
        return;
      }

      // 인증 정보 확인
      const auth = await getAuthByLoginId(user.id);
      if (!auth) {
        setError("This ID does not exist"); // ID 관련 에러로 통일
        setErrorField("id");
        return;
      }

      // 비밀번호 업데이트 성공
      await updatePassword(auth.id, newPw);
      alert("비밀번호가 변경되었습니다!");
      navigate("/login");
    } catch (e) {
      setError("비밀번호 변경 중 오류가 발생했어요.");
      setErrorField("all");
    }
  };

  // 입력값 변경 시 에러 초기화
  const handleLoginIdChange = (value) => {
    setLoginId(value);
    if (errorField === "id" || errorField === "all") {
      clearError();
    }
  };

  const handleNewPwChange = (value) => {
    setNewPw(value);
    if (errorField === "newPw" || errorField === "confirmPw" || errorField === "all") {
      clearError();
    }
  };

  const handleConfirmPwChange = (value) => {
    setConfirmPw(value);
    if (errorField === "confirmPw" || errorField === "all") {
      clearError();
    }
  };

  // 이 훅을 사용하는 컴포넌트에 필요한 값들 넘겨줌
  return {
    loginId,
    setLoginId: handleLoginIdChange,
    newPw,
    setNewPw: handleNewPwChange,
    confirmPw,
    setConfirmPw: handleConfirmPwChange,
    error,
    errorField, // 추가: 어떤 필드에서 에러가 발생했는지
    handleResetPassword,
  };
}

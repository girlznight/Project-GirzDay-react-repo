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
  const handleResetPassword = async () => {     //loginId, 새 비번, 새 비번확인 이 비어있으면 에러 표시
    if (!loginId || !newPw || !confirmPw) {
      setError("모든 항목을 입력해주세요.");      //에러 띄움
      return;                                   //실행 중지
    }

    if (newPw.length < 8) {                             //새 비번 길이가 8자 미만이면 에러 
      setError("비밀번호는 최소 8자 이상이어야 해요.");
      return;
    }

    if (newPw !== confirmPw) {                        //새 비번과 확인 비번이 다르면 에러러
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

     const user = await getUserByLoginId(loginId);  //입력한 loginId에 해당하는 유저 정보를 가져옴옴
    if (!user) {
      setError("존재하지 않는 ID입니다.");            //유저가 없으면 에러러
      return;
    }

    const auth = await getAuthByLoginId(user.id);   //해당 유저의 인증(auth) 정보 가져오기
    if (!auth) {
      setError("비밀번호 정보를 찾을 수 없습니다.");  //인증 정보가 없으면 에러 
      return;
    }

    try {
      await updatePassword(auth.id, newPw);   // 비밀번호를 새 비번으로 업데이트 요청
      alert("비밀번호가 변경되었습니다!");      //성공메시지
      navigate("/login");                     //로그인페이지로 이동
    } catch (e) {                             //에러 발생 시 메세지 표시 
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

import AuthInputBox from "../../components/AuthInputBox";
import CustomButton from "../../components/CustomButton";
import useResetPassword from "./useResetPassword";

//  "비밀번호 재설정 화면"을 보여주는
export default function ResetPassword() {
  const {
    loginId,                  //사용자가 입력한id
    setLoginId,               
    newPw,                    //새 비번
    setNewPw,                 
    confirmPw,                //새 비번 확인
    setConfirmPw,             
    error,
    handleResetPassword,      //버튼 누를때 실행됨 
  } = useResetPassword();

  // 실제 화면 구성 부분
  return (
    <div className="flex flex-col items-center gap-4 mt-20">
      <h1 className="text-3xl font-bold">.Yellowmemo</h1>
      <p className="text-sm text-gray-500">
        Think, memo, create your own idea board by just One-click
      </p>

      <AuthInputBox                                       //id창
        value={loginId}                                   //입력된 id
        onChange={(e) => setLoginId(e.target.value)}      //입력될때마다 상태저장
        placeholder="ID"                                  //흐리게 id표시
        isError={!!error}                                 //에러 시 빨간 테두리 
      />

      <AuthInputBox                                       //비번창
        value={newPw}                                     //입력된 새 비번
        onChange={(e) => setNewPw(e.target.value)}        //입력될때마다 상태 저장
        placeholder="NEW PW"                              //안내 문구
        type="password"                                   //비번 ●●●● 로 표시됨
        isError={!!error}                                 //에러 시 빨간 테두리
      />  

      <AuthInputBox                                       //비번 확인창
        value={confirmPw}                                 //비번 재입력
        onChange={(e) => setConfirmPw(e.target.value)}    //입력될때마다 상태 저장
        placeholder="Confirm NEW PW"                      //안내문구
        type="password"                                   //비번 ●●●● 로 표시됨
        isError={!!error}                                 //에러 시 빨간 테두리
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}  {/* 에러 메시지 보여줌 (에러 있을 때만) */}

      <CustomButton onClick={handleResetPassword} text="Set new PW" />   {/* 비밀번호 재설정 버튼 */}

      <a href="/login" className="text-sm text-blue-500 underline"> {/* 로그인 페이지로 가는 링크 */}
        Login
      </a>
    </div>
  );
}

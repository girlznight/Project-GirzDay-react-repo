import AuthInputBox from "../../components/AuthInputBox";
import CustomButton from "../../components/CustomButton";
import useResetPassword from "./useResetPassword";

//  "비밀번호 재설정 화면"을 보여주는
export default function ResetPassword() {
  const {
    loginId, //사용자가 입력한id
    setLoginId,
    newPw, //새 비번
    setNewPw,
    confirmPw, //새 비번 확인
    setConfirmPw,
    error,
    errorField, //어떤 필드에 에러가 있는지
    handleResetPassword, //버튼 누를때 실행됨
  } = useResetPassword();

  // 실제 화면 구성 부분
  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
      <div className="w-full max-w-[700px] flex flex-col items-center">
        <h1 className="text-5xl font-bold text-black mb-2 w-full text-left">
          .Yellowmemo
        </h1>
        <p className="text-base text-black/60 mb-10 w-full text-left">
          Think, memo, create your own idea board by just One-click
        </p>

        <div className="w-full flex flex-col items-center mb-2">
          <AuthInputBox
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="ID"
            hasError={errorField === "id"} // ID 에러일 때만 빨간 테두리
          />
          {errorField === "id" && error && (
            <p className="text-[#ff0000] text-base mb-2 w-[400px] text-left">
              {error}
            </p>
          )}
        </div>

        {/* NEW PW 입력박스 */}
        <div className="w-full flex flex-col items-center mb-2">
          <AuthInputBox
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="NEW PW"
            type="password"
            hasError={errorField === "confirmPw"} // 비밀번호 불일치 시 빨간 테두리
          />
        </div>

        {/* Confirm NEW PW 입력박스 */}
        <div className="w-full flex flex-col items-center mb-2">
          <AuthInputBox
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Confirm NEW PW"
            type="password"
            hasError={errorField === "confirmPw"} // 비밀번호 불일치 시 빨간 테두리
          />
          {errorField === "confirmPw" && error && (
            <p className="text-[#ff0000] text-base mb-2 w-[400px] text-left">
              {error}
            </p>
          )}
        </div>

        <CustomButton //비밀번호 재설정 버튼
          onClick={handleResetPassword}
          className="w-[190px] h-14 bg-white text-black rounded-full shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] font-normal text-lg mt-4 mb-6"
        >
          Set New Password
        </CustomButton>

        <a href="/login" className="text-base text-[#3b82f6] underline">
          {" "}
          {/* 로그인 페이지로 가는 링크 */}
          Login
        </a>
      </div>
    </div>
  );
}

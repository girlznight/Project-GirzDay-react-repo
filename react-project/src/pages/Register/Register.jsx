//이 파일은 회원가입 화면만 보여줍니다 
//진짜 화면에 어떻게 보일지만 담당하고
//함수나 api요청은 다른 파일에서 가져옵니다

import AuthInputBox from "../../components/AuthInputBox";
import CustomButton from "../../components/CustomButton";
import useRegister from "./useRegister"

//회원가입 화면 컴포넌트 함수
export default function Register() {
  const {           //useRegister에서 상태값과 동작 함수를 가져옵니다 
    loginId, setLoginId,            //입력한 id와 그걸 바꾸는 함수
    password, setPassword,          //입력한 pw와 그걸 바꾸는 함수
    confirmPw, setConfirmPw,        //비번 확인 값과 그걸 바꾸는 함수
    error,                          //에러 메세지
    handleRegister                  //회원가입 버튼 눌렀을때 실행할 함수
  } = useRegister();

//화면에 보여지는 부분

  return(
      <div className="min-h-screen bg-[#fcfcf8] px-16 pt-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-gray-900">.Yellowmemo</h1>
          <p className="text-lg sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-normal">
            Think, memo, create your own idea board by just One-click
          </p>

  <div className="flex flex-col items-center w-full mt-24">  
    <div className="flex flex-col items-center w-full max-w-[700px]">
      <AuthInputBox                                     // 아이디 입력창
        value={loginId}                                 // 입력된 ID 값
        onChange={(e) => setLoginId(e.target.value)}    // 입력될 때 상태 저장
        placeholder="ID"                                // 흐리게 'ID' 라고 표시
        hasError={!!error}                               // 에러 있으면 테두리 빨갛게
      />
      <AuthInputBox                                     //비번 입력창
         value={password}                               //입력된 비번값
         onChange={(e) => setPassword(e.target.value)}  //입력될 때 상태 저장
         placeholder="PW"                               //흐리게 "PW" 라고 표시
         type="password"                                //입력값이 ●●● 로 보이게
         hasError={!!error}                               //에러가 있으면 테두리 빨갛게
      />

      <AuthInputBox                                     //비번 다시 확인하는 입력창 
        value={confirmPw}                               //입력된 확인 비번 값
        onChange={(e) => setConfirmPw(e.target.value)}  //입력될 때 마다 값 저장
        placeholder="Confirm PW"                        //흐리게 보이는 안내 문구
        type="password"                                 //입력값이 ●●● 로 보이게
        hasError={!!error}                               //에러가 있으면 테두리 빨갛게
      />
    </div>

      {error && (
        <p className="text-[#ff0000] text-base mb-4 w-[400px] text-center">{error}</p>   //에러가 있을 때만 빨간 글씨로 화면에 보여줌 
      )}
      
      <CustomButton 
      onClick={handleRegister}
      className="w-[180px] h-14 bg-white text-black rounded-full shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] font-normal text-lg mt-4 mb-6"
      >Create account
      </CustomButton>  {/*회원가입 버튼*/}
      
      <span className="text-base text-black">
       I already have{" "}
      <a href="/login" className="text-[#3b82f6] no-underline hover:underline">
        account   {/*이미 계정이 있을때 누르면 로그인 페이지로 이동*/}
      </a>
      </span>
    </div>
  </div>
  )
}
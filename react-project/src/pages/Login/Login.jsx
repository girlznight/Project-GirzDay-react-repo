//이 파일은 로그인 화면을 만드는 코드입니다.

//다른 파일에서 만들어놓은 컴포넌트와 React 기능을 불러옵니다
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthInputBox from "../../components/AuthInputBox"; //아이디 비번 입력 박스
import CustomButton from "../../components/CustomButton.jsx"; //로그인 버튼
import useLogin from "./useLogin.js"; //로그인 동작을 처리하는 훅을 가져옴


//밑의 함수는 실제로 화면에 보여지는 로그인 컴포넌트
export default function Login() {
  //여기서 useLogin이라는 함수를 실행해서 필요한 값과 기능들을 가져옴
  const {
    loginId,            // 사용자가 입력한 아이디값
    password,           // 사용자가 입력한 비밀번호 값
    setLoginId,         // 아이디를 바꿔주는 함수
    setPassword,        // 비밀번호를 바꿔주는 함수
    error,              // 에러 메세지( 틀렸을때 뜨는 말 )
    handleLogin,        // 로그인 버튼을 눌렀을 때 실행되는 함수
    redirectIfLoggedIn, // 로그인된 유저가 로그인 페이지에 접근했을 때 강제로 게시글 화면으로 튕겨냄
  } = useLogin();        // useLogin 훅을 호출하면 위에 값들을 사용할 수 있다


  // 페이지가 처음 열릴 때 로그인 상태인 경우, 로그인 페이지에 머무르지 못하게 하고
  // 자동으로 해당 유저의 최근 글 또는 글쓰기 페이지로 이동시키는 처리
  const navigate = useNavigate();
  useEffect(()=> {
    const userId = localStorage.getItem("userId"); // 로컬 스토리지에서 userId 꺼냄(로그인 되어있는지 확인한다)
    if (userId){                                   // userId가 존재한다면 = 로그인 되어있다면
      navigate(`/post/&{1}`, {replace:true})       // 페이지로 강제 이동(replace: 뒤로 가기 방지)
    }
  },[]);

  // 로그인 상태일 때, 가장 최근 게시글로 이동하거나 새 글 작성 페이지로 이동시킴
  // 로그인한 상태로 다시 로그인 페이지 오면 자동 리디렉션
   useEffect(() => {
    redirectIfLoggedIn(); //redirectIfLoggedIn을 컴포넌트가 실행되자마자 실행시켜야 함
  }, []);                 //페이지 열리자마자 로그인 상태면 튕겨내기

  
  return (
    <div className="min-h-screen bg-[#fcfcf8] px-16 pt-20">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-gray-900">.Yellowmemo</h1>
        <p className="text-lg sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-normal">
          Think, memo, create your own idea board by just One-click
       </p>
    
   <div className="flex flex-col items-center w-full mt-24">  
    <div className="flex flex-col items-center w-full max-w-[700px]">
      {/* 아이디 입력 박스: 값을 loginId로 채우고, 바뀌면 setLoginId로 저장 */}
      <AuthInputBox
        value={loginId} // 현재 입력된 ID
        onChange={(e) => setLoginId(e.target.value)} // 입력값이 바뀌면 저장
        placeholder="ID" // 흐리게 'ID' 라고 보임
        hasError={!!error} // 에러가 있으면 빨간 테두리
      />

      {/* 비밀번호 입력 박스 */}
      <AuthInputBox
        value={password} // 현재 입력된 PW
        onChange={(e) => setPassword(e.target.value)} // 입력값이 바뀌면 저장
        placeholder="PW" // 흐리게 'PW' 라고 보임
        type="password" // 비밀번호니까 입력한 글자가 안 보임
        hasError={!!error} // 에러가 있으면 빨간 테두리
      />
    </div>

      {/* 에러 메시지 보여주기 (에러가 있을 때만 보여짐) */}
      {error && (
        <p className="text-[#ff0000] text-base mb-1 w-[400px] text-center">
           Please check your ID/PASSWORD
        </p>
      )}

      {/* 로그인 버튼 누르면 handleLogin 함수 실행 */}
      <CustomButton 
        onClick={handleLogin}
        className="w-[180px] h-14 bg-white text-black rounded-full shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] font-normal text-lg mt-5 mb-10"
        >
        Login
      </CustomButton>

     <span className="flex flex-col gap-2 items-center w-[400px]">
      <p className="text-base text-black">
        I don’t have{" "}
        <a href="/register" className="text-[#3b82f6] underline">
          account
        </a>
    </p>
    <p className="text-base text-black">
      I forgot my{" "}
      <a href="/reset-password" className="text-[#3b82f6] underline">
        password
          </a>
        </p>
        </span>
      </div>
    </div>
  );
}
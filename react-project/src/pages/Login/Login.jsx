//이 파일은 로그인 화면을 만드는 코드입니다.

//다른 파일에서 만들어놓은 컴포넌트와 React 기능을 불러옵니다
import AuthInputBox from "../../components/AuthInputBox"; //아이디 비번 입력 박스
import Button from "../../components/Button"; //로그인 버튼
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
  } = useLogin();        // useLogin 훅을 호출하면 위에 값들을 사용할 수 있다


  return (
    <div className="flex flex-col items-center gap-4 mt-20">
      <h1 className="text-3xl font-bold">.Yellowmemo</h1>{" "}
      <p className="text-sm text-gray-500">
        {" "}
        Think, memo, create your own idea board by just One-click
      </p>

      {/* 아이디 입력 박스: 값을 loginId로 채우고, 바뀌면 setLoginId로 저장 */}
      <AuthInputBox
        value={loginId} // 현재 입력된 ID
        onChange={(e) => setLoginId(e.target.value)} // 입력값이 바뀌면 저장
        placeholder="ID" // 흐리게 'ID' 라고 보임
        isError={!!error} // 에러가 있으면 빨간 테두리
      />

      {/* 비밀번호 입력 박스 */}
      <AuthInputBox
        value={password} // 현재 입력된 PW
        onChange={(e) => setPassword(e.target.value)} // 입력값이 바뀌면 저장
        placeholder="PW" // 흐리게 'PW' 라고 보임
        type="password" // 비밀번호니까 입력한 글자가 안 보임
        isError={!!error} // 에러가 있으면 빨간 테두리
      />

      {/* 에러 메시지 보여주기 (에러가 있을 때만 보여짐) */}
      {error && (
        <p className="text-red-500 text-sm">
          {error} {/* 예: ID 또는 비밀번호가 틀렸습니다 */}
        </p>
      )}

      {/* 로그인 버튼 누르면 handleLogin 함수 실행 */}
      <Button onClick={handleLogin} text="Login" />
      <div className="mt-2">
        <a href="/register" className="text-sm text-blue-500 underline">
          I don’t have an account
        </a>
        <a
          href="/reset-password"
          className="text-sm text-blue-500 underline ml-4"
        >
          I forgot my password
        </a>
      </div>
    </div>
  );
}

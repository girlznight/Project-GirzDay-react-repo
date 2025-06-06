// 이 파일에서는 로그인 기능에 필요한 로직(상태, 버튼 눌렀을 때 동작 등)을 따로 정리했습니다.

import { useState } from "react";             //상태 저장
import {useNavigate} from "react-router-dom"  //페이지 이동
import { getUserByLoginId, getAuthByLoginId, getRecentPostByUserId } from "./loginApi"  //로그인할 때 서버랑 통신할 함수들을 여기서 불러옵니다 (다른 파일에서 만든거)
                                            
// login 페이지에서 쓸 수 있게 만들어주는 훅입니다
export default function useLogin() {
    const [loginId, setLoginId] = useState("");     // 아이디 입력값 저장
    const [password, setPassword] = useState("");   // 비밀번호 입력값 저장
    const [error, setError] = useState("");         // 에러 메세지 저장
    const navigate = useNavigate();                 // 페이지 이동할때 (예: 로그인 성공하면 게시글 페이지 이동)

    const handleLogin = async () => {              //로그인 버튼을 눌렀을 때 실행행
        try{
            const user = await getUserByLoginId(loginId);  //입력한 ID로 user 정보 가져옴
            if(!user) {
                setError("존재하지 않는 ID입니다.");         //유저가 없으면 에러 메세지           
                return;
            }
            
            const isValid = await getAuthByLoginId(user.id, password); //입력한 비밀번호가 맞는지 확인
            if(!isValid) {  
                setError("ID 또는 비밀번호가 일치하지 않습니다");         //비밀번호가 틀리면 에러 메세지
                return;
            }

            localStorage.setItem("userId", user.id);   //로그인 성공하면 브라우저에 로그인된 유저 정보 저장 (유저id 저장장)

            const recentPost = await getRecentPostByUserId(user.id);    //로그인한 유저가 가장 최근에 쓴 글 가져오기 
            if(recentPost) {
                navigate(`/post/${recentPost.id}`);                     //최근 글이 있으면 글로 이동
            } else {    
                navigate("/post/create");                               //글이 없으면 글 작성 페이지로 
            }
            
        } catch (err) {
            setError("로그인 중 오류 발생")         //예기치 못한 에러가 생기면 에러 표시
        }
    };

    //아래에서는 Login.jsx에서 쓸 수 있게 상태랑 함수를 내보냅니다

    return{
        loginId,      //현재 입력된 Id
        password,     //현재 입력된 비번
        setLoginId,   //id변경
        setPassword,  //비번 변경
        error,        //에러 
        handleLogin,  //로그인 실행 
    };

}
// 회원가입 기능만 있는 파일입니다
// 상태값 관리 + 버튼 클릭 처리만 관리

import {useState} from "react"
import {useNavigate} from "react-router-dom"
import { createUserAndAuth } from "./registerApi";  
import { getUserByLoginId } from "../Login/loginApi";

export default function useRegister() {                     //id, 비번, 비번확인을 저장
    const [loginId, setLoginId] = useState("");             //입력된 id저장
    const [password, setPassword] = useState("");           //입력된 비번 저정
    const [confirmPw, setConfirmPw] = useState("");         //비번 확인용 입력 저장
    const [error, setError] = useState("");                    //에러 메세지 저장
    const navigate = useNavigate();                         //페이지 이동

    const handleRegister = async () => {                    //회원가입 버튼을 눌렀을때 
        if (!loginId || !password || !confirmPw){           //필수 입력값 체크 ( 3개의 값들중 하나라도 비어있으면 true가 됨  )
            setError("모든 항목을 입력해주세요");             //loginId가 비었거나, password가 비었거나, confirmPw가 비었으면
            return;
        }
        
        if (password.length < 8) {                          //비밀번호 길이 체크 
            setError("비밀번호는 최소 8자 이상이어야 해요.");
            return;
        }

        if (password !== confirmPw){                        //비밀번호와 확인값이 같은지 체크
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        const existingUser = await getUserByLoginId(loginId);   //이미 존재하는 id인지 확인인
        if (existingUser){
            setError("이미 존재하는 ID 입니다.");
            return;
        }

        try{
            await createUserAndAuth(loginId, password);         //회원가입 요청(user + auth 테이블에 추가) 유저 + 비번 등록록
            navigate("/login");                                 //완료되면 로그인 페이지로 이동 
        } catch (e) {
            setError("회원가입 중 오류 발생했어요.");
        }
    };

    return{
        loginId, setLoginId,
        password, setPassword,
        confirmPw, setConfirmPw,
        error,
        handleRegister,
    };
}
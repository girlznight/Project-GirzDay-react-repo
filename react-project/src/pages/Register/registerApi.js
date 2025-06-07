//이 파일은 서버에 요청을 보냅니다
//ID 중복확인
//회원가입 추가 

// import { Profile } from "react"; 추후 사용

const API_URL = "http://localhost:5000";

//ID로 유저가 이미 존재하는지?
export async function getUserByLoginId(loginId){
    const res = await fetch(`${API_URL}/user?loginId=${loginId}`)  //이 loginID를 가진 유저가 있는지 확인(서버에 요청)
    const data = await res.json();                                 //응답을 json으로변환

    return data[0] || null;                                        //첫 번째 유저 있으면 그걸 리턴, 없으면 null

} 

//유저 + 비밀번호를 서버에 저장 
export async function createUserAndAuth(loginId, password){
    const userRes = await fetch(`${API_URL}/user`,{            //post요청을 보냄 (URL은 /user, user 테이블에 추가하겠다)
        method:"POST",
        headers: {"Content-Type": "application/json"},        //보내는 데이터 형식은 JSON
        body: JSON.stringify({                                //실제로 보낼 데이터는 아래의 두개 
            loginId: loginId,
            profile: ""
        })
    });

    const newUser = await userRes.json(); //요청 결과로 서버가 응답해준 유저 데이터를 JSON으로 바꿔서 저장

    //auth 테이블에 비번 저장 (userId와 연결)
    await fetch (`${API_URL}/auth`,{
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            userId: newUser.id,   //위에서 만든 유저 ID
            password: password,   //입력받은 비번
        })
    });
}
    

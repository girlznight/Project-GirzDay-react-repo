//이 파일은 로그인 할때 db에 요청을 보내는 코드입니다 
//예: 이 id 있어요?, 이 비번 있어요?, 최근 글 뭐에요? 같은걸 서버에 물어봄

const API_URL = "http://localhost:5000";


//아이디로 user 정보를 가져옴
export async function getUserByLoginId(loginId) {
    const res = await fetch(`${API_URL}/user?loginId=${loginId}`);  //서버에 get요청 -> id가 일치하는 유저 찾아줘잉잉
    const data = await res.json()                                   //응답을 json으로 변환

    return data[0] || null;   
}

//유저id로 비번이 맞는지 확인
export async function getAuthByLoginId(userId, inputPw) {           //유저 id와 비밀번호가 일치하는지 확인하는 함수 
    const res = await fetch(`${API_URL}/auth?userID=${userId}`);     //서버에서 userId에 해당하는 auth 정보를 가져옴 (비밀번호 포함된 테이블)
    const data = await res.json();                                  // 응답을 json으로 변환

    if (data.length === 0) return false;                            //해당 유저가 없으면 false 반환( 비회원 또는 등록되지 않은 사용자 )

    const storedPw = String(data[0].password).trim();                 //저장된 비빌번호를 문자열로 변환하고, 앞뒤 공백 제거
    const input = String(inputPw).trim();                             //사용자가 입력한 비밀번호도 문자열로 변환하고 공백 제거
            
    return storedPw === input;                                      //비밀번호가 일치하면 true, 아니면 false      
}

//최근에 작성한 게시글 하나 가져옴
export async function getRecentPostByUserId(userId) {
    const res = await fetch(`${API_URL}/post?userId=${userId}$_sort=id$_order=desc`);  //해당 유저의 글에서 가장 최근 게시글 1개 가져오기
    const data = await res.json();
    
    return data[0] || null //가장 최신 글 리턴, 없으면 null
}
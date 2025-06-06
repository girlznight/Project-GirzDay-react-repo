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
export async function getAuthByLoginId(userId, inputPw) {
    const res = await fetch(`${API_URL}/auth?userID=${userId}`);     // 해당 userId를 가진 auth 정보 가져오기 (비번 테이블) 요청
    const data = await res.json();                                  // 응답을 json으로 변환
    
    return data.length > 0 && data[0].password === inputPw;        //auth 데이터가 있고, 비번이 사용자가 입력한거랑 같으면 true
}

//최근에 작성한 게시글 하나 가져옴
export async function getRecentPostByUserId(userId) {
    const res = await fetch(`${API_URL}/post?userId=${userId}$_sort=id$_order=desc`);  //해당 유저의 글에서 가장 최근 게시글 1개 가져오기
    const data = await res.json();
    
    return data[0] || null //가장 최신 글 리턴, 없으면 null
}
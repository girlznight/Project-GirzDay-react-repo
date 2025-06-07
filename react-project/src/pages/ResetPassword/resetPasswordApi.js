// json-server 기본 주소
const API_URL = "http://localhost:5000";

// 입력한 loginId로 user 조회 (실제로 존재하는지지)
export async function getUserByLoginId(loginId) {
  const res = await fetch(`${API_URL}/user?loginId=${loginId}`);
  const data = await res.json();
  return data[0] || null;
}

// userId에 해당하는 auth 정보 가져오기
export async function getAuthByLoginId(userId) {
  const res = await fetch(`${API_URL}/auth?userId=${userId}`);
  const data = await res.json();
  return data.length > 0 ? data[0] : null;  // 있으면 첫 auth 리턴, 없으면 null
}

// 해당 userId의 비밀번호 수정 (PATCH 요청)
export async function updatePassword(authId, newPassword) {
  // PATCH 로 비밀번호만 교체
  await fetch(`${API_URL}/auth/${authId}`, {
    method : "PATCH",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ password: newPassword })
  });
}

export function getMaxLineLength(text) {
  // 여러 줄 중 가장 긴 줄의 글자 수 반환
  return Math.max(...(text || "").split('\n').map(line => line.length), 0);
}
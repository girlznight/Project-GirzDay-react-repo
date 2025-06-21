import { useEffect, useState } from "react";

export default function usePostits(id) {
  const [postits, setPostits] = useState([]);

  useEffect(() => {
    // 포스트잇 가져오기
    fetch(`http://localhost:5000/postit?postId=${id}`)
      .then(res => res.json())
      .then(setPostits);
  }, [id]);

  return [postits, setPostits];
}

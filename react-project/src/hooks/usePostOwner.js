import { useEffect, useState } from "react";

export default function usePostOwner(id) {
  const [ownerId, setOwnerId] = useState(null);

  useEffect(() => {
    // ownerId 가져오기
    fetch(`http://localhost:5000/post/${id}`)
      .then(res => res.json())
      .then(post => setOwnerId(Number(post.userId)));
  }, [id]);

  return ownerId;
}

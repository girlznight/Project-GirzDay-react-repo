import { useEffect, useState } from "react";

export default function useImages(id) {
  const [images, setImages] = useState([]); // image 상태

  useEffect(() => {
    // 이미지 데이터 가져오기
    fetch(`http://localhost:5000/image?postId=${id}`)
      .then(res => res.json())
      .then(setImages);
      // 포스트잇 가져오기
  }, [id]);

  return [images, setImages];
}

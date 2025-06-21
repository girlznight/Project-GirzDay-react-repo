import { useEffect, useState } from "react";

export default function useTextboxes(id) {
  const [textboxes, setTextboxes] = useState([]);

  useEffect(() => {
    // text box 데이터 가져오기
    fetch(`http://localhost:5000/textbox?postId=${id}`)
      .then(res => res.json())
      .then(setTextboxes);
  }, [id]);

  return [textboxes, setTextboxes];
}

import { useLocation, useParams, useNavigate } from "react-router-dom";
import TextIcon from '../assets/postmenubar_text.svg';
import ImageIcon from '../assets/postmenubar_add-image.svg';
import CheckIcon from '../assets/postmenubar_check.svg';
import { useEffect, useState, useRef } from "react";

function PostMenuBar({ textboxes, images }) {
  const location = useLocation(); // 현재 경로 정보
  // useParams를 사용하여 URL 파라미터 접근

  const params = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);
  const fileInputRef = useRef();

  const isEdit = location.pathname.startsWith("/post/edit/"); // url이 /post/edit/로 시작하는지 확인
  const isCreate = location.pathname === "/post/create";

  // edit 페이지라면 post 데이터 불러오기
  useEffect(() => {
    if (isEdit) {
      fetch(`http://localhost:3000/post/${params.id}`)
        .then(res => res.json())
        .then(data => setPostData(data));
    }
  }, [location, params.id]); // 컴포넌트가 마운트될 때와 location(url), post id가 변경될 때마다 실행

  const handleCheck = async () => {
    if (isCreate) {
      // POST: post, textbox, image 등 생성
      const newPost = await fetch("http://localhost:3000/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1 /* 실제 userId로 대체 */ })
      }).then(res => res.json());

      // 예시: textbox, image도 각각 POST
      await Promise.all(
        textboxes.map(tb => 
          fetch("http://localhost:3000/textbox", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...tb, postId: newPost.id })
          })
        )
      );
      await Promise.all(
        images.map(img => 
          fetch("http://localhost:3000/image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...img, postId: newPost.id })
          })
        )
      );

      alert("생성 완료!");
      navigate(`/post/${newPost.id}`);
    } else if (isEdit) {

      // PATCH: post/{id}
      await fetch(`http://localhost:3000/post/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...postData })
      });
      await Promise.all(
        textboxes.map(tb => 
          fetch(`/textbox/${tb.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tb)
          })
        )
      );
      await Promise.all(
        images.map(img => 
          fetch(`/image/${img.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(img)
          })
        )
      );
      alert("수정 완료!");
      navigate(`/post/${params.id}`);
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        // base64 데이터 활용
        console.log(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // 텍스트박스 아이콘 클릭 시
  const handleTextButtonClick = () => {
    // TODO: 텍스트박스 컴포넌트 렌더링 로직 추가
    console.log("텍스트박스 추가 버튼 클릭됨");
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[50%] max-w-md h-16px bg-white shadow-lg rounded-2xl px-6 py-3 px-20 flex justify-between items-center">
      {/* 텍스트 아이콘 */}
      <button
        type="button"
        className="flex flex-col items-center hover:scale-110 transition duration-200"
        onClick={handleTextButtonClick}
      >
        <img src={TextIcon} alt="Text" className="w-6 h-6" />
      </button>
      
      {/* 이미지 아이콘 */}
      <button
        type="button"
        className="flex flex-col items-center hover:scale-110 transition duration-200"
        onClick={handleImageButtonClick}
      >
        <img src={ImageIcon} alt="Add Image" className="w-6 h-6" />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      {/* 완료 체크 아이콘 */}
      <button onClick={handleCheck} className="flex flex-col items-center hover:scale-110 transition duration-200">
        <img src={CheckIcon} alt="Submit" className="w-6 h-6" />
      </button>
    </div>
  );
}

export default PostMenuBar;
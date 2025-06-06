import TextIcon from '../assets/postmenubar_text.svg';
import ImageIcon from '../assets/postmenubar_add-image.svg';
import CheckIcon from '../assets/postmenubar_check.svg';

function PostMenuBar({ onAddTextbox, onAddImage, onCheck, fileInputRef, onImageFileChange }) {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[50%] max-w-md h-16 bg-white shadow-lg rounded-2xl px-20 flex justify-between items-center">
      <button onClick={onAddTextbox}>
        <img src={TextIcon} alt="텍스트박스 추가" className="w-6 h-6" />
      </button>
      <button onClick={() => fileInputRef.current.click()}>
        <img src={ImageIcon} alt="이미지 추가" className="w-6 h-6" />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onImageFileChange}
      />
      <button onClick={onCheck}>
        <img src={CheckIcon} alt="저장" className="w-6 h-6" />
      </button>
    </div>
  );
}
export default PostMenuBar;
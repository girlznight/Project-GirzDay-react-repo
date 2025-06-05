import TextIcon from '../assets/postmenubar_text.svg';
import ImageIcon from '../assets/postmenubar_add-image.svg';
import CheckIcon from '../assets/postmenubar_check.svg';

function PostMenuBar() {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[50%] max-w-md h-16px bg-white shadow-lg rounded-2xl px-6 py-3 px-20 flex justify-between items-center">
      {/* 텍스트 아이콘 */}
      <button className="flex flex-col items-center hover:scale-110 transition duration-200">
        <img src={TextIcon} alt="Text" className="w-6 h-6" />
      </button>

      {/* 이미지 아이콘 */}
      <button className="flex flex-col items-center hover:scale-110 transition duration-200">
        <img src={ImageIcon} alt="Add Image" className="w-6 h-6" />
      </button>

      {/* 완료 체크 아이콘 */}
      <button className="flex flex-col items-center hover:scale-110 transition duration-200">
        <img src={CheckIcon} alt="Submit" className="w-6 h-6" />
      </button>
    </div>
  );
}

export default PostMenuBar;
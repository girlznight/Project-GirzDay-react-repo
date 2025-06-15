import NoteBg from "../assets/sticky-note.png";
import DiscardIcon from "../assets/discardbutton_trash.svg";

// CommentEditPopup 컴포넌트
// 기존 포스트잇을 수정/삭제할 수 있음

export default function CommentEditPopup({
  open, onClose, value, onChange, onSave, onDelete,}) {
  if (!open) return null; // open이 false면 렌더링하지 않음

  return (
    <div
      className="fixed inset-0 bg-white bg-opacity-80 z-[99] flex items-center justify-center"
    >
      <div
        className="relative w-[380px] h-[380px] p-6 drop-shadow-2xl"
        style={{
          backgroundImage: `url(${NoteBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "rotate(2deg)",
        }}
      >
        {/* × 버튼: 상단 왼쪽, onClose 호출 */}
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-xl"
        >
          ✕
        </button>

        {/* 편집용 textarea: value 표시, onChange 호출 */}
        <textarea
          className="w-full h-full bg-transparent outline-none resize-none text-[17px] pl-2 pt-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={190}
        />

        {/* ✓ 버튼: 하단 오른쪽, onSave 호출 */}
        <button
          onClick={onSave}
          className="absolute bottom-4 right-4 text-2xl leading-none"
        >
          ✓
        </button>

        {/* 휴지통 아이콘: 하단 왼쪽, onDelete 호출 */}
        <button
          onClick={onDelete}
          className="absolute bottom-4 left-4 p-1"
        >
          <img
            src={DiscardIcon}
            alt="삭제"
            className="w-6 h-6"
            style={{ filter: "none" }}
          />
        </button>
      </div>
    </div>
  );
}
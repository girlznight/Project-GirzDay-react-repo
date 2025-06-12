import AlertPopup from "./AlertPopup";
import NoteBg from "../assets/sticky-note.png";

export default function CommentPopup({ open, onClose, value, onChange, onSave }) {
  if (!open) return null;

  return (
    <AlertPopup onClose={onClose}>
      <div
        className="relative w-[380px] h-[380px] p-6 drop-shadow-2xl"
        style={{
          backgroundImage: `url(${NoteBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "rotate(2deg)",
        }}
      >
        <textarea
          className="w-full h-full bg-transparent outline-none resize-none text-[17px]"
          placeholder="코멘트를 남겨주세요…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {/* 저장 버튼 */}
        <button onClick={onSave}
                className="absolute bottom-4 right-4 text-2xl leading-none">
          ✔︎
        </button>
      </div>
    </AlertPopup>
  );
}
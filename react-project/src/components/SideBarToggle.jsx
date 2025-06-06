// src/components/SidebarToggleButton.js
function SidebarToggleButton({ onClick }) {
  return (
    <button
      className="fixed top-6 left-6 z-60 rounded-full w-14 h-14 flex items-center justify-center text-2xl hover: transition"
      onClick={onClick}
      aria-label="Open sidebar"
    >
      ≡
    </button>
  );
}

export default SidebarToggleButton;

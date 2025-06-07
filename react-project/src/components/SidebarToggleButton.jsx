import ToggleIcon from "../assets/sidebar_toggle.svg";

function SidebarToggleButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 left-6 z-[100]"
      aria-label="Open sidebar"
    >
      <img src={ToggleIcon} alt="sidebar toggle" className="w-8 h-8" />
    </button>
  );
}

export default SidebarToggleButton;

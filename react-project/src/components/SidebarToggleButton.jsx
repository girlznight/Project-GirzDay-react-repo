import ToggleIcon from '../assets/sidebar_toggle.svg';

function SidebarToggleButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        background: "none",
        border: "none",
        cursor: "pointer",
        zIndex: 1000,
      }}
      aria-label="Open sidebar"
    >
      <img src={ToggleIcon} alt="toggle" width={40} height={40} />
    </button>
  );
}

export default SidebarToggleButton;

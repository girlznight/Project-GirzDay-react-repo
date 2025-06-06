import DiscardIcon from '../assets/discardbutton_trash.svg';

function DiscardButton({ onDiscard }) {
  return (
    <button
      onClick={onDiscard}
      title="Discard changes"
      className="
        fixed bottom-8 right-8 z-50
        p-3
        flex items-center justify-center
        transition-colors
        rounded-lg
        hover:bg-red-100
        group
      "
    >
      <img
        src={DiscardIcon}
        alt="Discard"
        className="
          w-6 h-6
          transition-colors
          group-hover:filter group-hover:invert-29 group-hover:sepia-69 group-hover:saturate-749 group-hover:hue-rotate-314 group-hover:brightness-102 group-hover:contrast-102
        "
        style={{
          filter: 'none'
        }}
      />
    </button>
  );
}

export default DiscardButton;

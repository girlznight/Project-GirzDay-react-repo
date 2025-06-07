import { comment } from 'postcss';
import ShareIcon from '../assets/post_share.svg';
import Comment from '../assets/post_comment.svg';
import DiscardButton from './DiscardButton';

function ShareButton({ onClick }) {
  return (
    <div className="flex space-x-2">
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-gray-100 transition group"
      aria-label="Add comment"
    >
      <img src={Comment} alt="share" className="w-6 h-6 group-hover:scale-110 transition-transform" />
    </button>
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-gray-100 transition group"
      aria-label="Share"
    >
      <img src={ShareIcon} alt="share" className="w-6 h-6 group-hover:scale-110 transition-transform" />
    </button>
    <DiscardButton />
    </div>
  );
}

export default ShareButton;

import React from "react";

function AlertPopup({ show, onYes, onNo }) {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-72 text-center">
        <p className="mb-4 text-lg">정말 삭제하시겠어요?</p>
        <div className="flex justify-center space-x-4">
          <button onClick={onYes} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">네</button>
          <button onClick={onNo} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">아니요</button>
        </div>
      </div>
    </div>
  );
}

export default AlertPopup;

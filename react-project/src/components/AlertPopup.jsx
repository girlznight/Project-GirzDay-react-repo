// 전부 챗지피티
import React from "react";
import CustomButton from "./CustomButton";

function AlertPopup({ show, onYes, onNo, message }) {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#fcfcf8] bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white bg-opacity-90 p-6 rounded-xl w-80 text-center shadow-lg">
        <p className="mb-6 text-lg font-medium">{message}</p>
        <div className="flex justify-center space-x-4">
          <CustomButton
            onClick={onYes}
            className="w-24 h-10 border border-black text-black bg-transparent"
          >
            Yes
          </CustomButton>
          <CustomButton
            onClick={onNo}
            className="w-24 h-10 bg-black text-white"
          >
            No
          </CustomButton>
        </div>
      </div>
    </div>
  );
}

export default AlertPopup;
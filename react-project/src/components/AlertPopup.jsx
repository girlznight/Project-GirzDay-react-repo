import React from "react";
import { Button } from "./Button";

/**
 * 경고 팝업 컴포넌트
 * @param {function} onYes 확인(예) 버튼 클릭 시 실행될 함수
 * @param {function} onNo 취소(아니오) 버튼 클릭 시 실행될 함수
 * @param {string} message 팝업에 보여질 메시지 (기본값: "정말 삭제하시겠습니까?")
 */

export const AlertPopup = ({
  onYes,
  onNo,
  message = "정말 삭제하시겠습니까?"
}) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="alert-popup-title"
  >
    {/* 팝업 박스 */}
    <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full">
      <p
        id="alert-popup-title"
        className="mb-4 text-center text-gray-900"
      >
        {message}
      </p>
      {/* 버튼 그룹 */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={onYes}
          bgColor="bg-red-500 hover:bg-red-600"
          shadow="shadow"
          className="text-white"
        >
          예
        </Button>
        <Button
          onClick={onNo}
          bgColor="bg-gray-300 hover:bg-gray-400"
          shadow="shadow"
          className="text-gray-800"
        >
          아니오
        </Button>
      </div>
    </div>
  </div>
);


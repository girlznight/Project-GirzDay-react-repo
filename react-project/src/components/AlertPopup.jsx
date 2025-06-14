import React from "react";
import CustomButton from "./CustomButton";

// AlertPopup 기능
// Yes/No 선택지를 띄우는 팝업
//  show가 true일 때만 화면에 보임
// message: 사용자에게 보여줄 문구
// onYes: Yes 클릭 시 실행할 콜백함수
// //onNo No 클릭 시 실행할 콜백함수

function AlertPopup({ show, onYes, onNo, message }) {
  if (!show) return null; // Show가 flase면 아무것도 렌더링하지 않음

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#fcfcf8] bg-opacity-60 flex justify-center items-center z-50"> {/* 반투명 오버레이 */}
      <div className="bg-white bg-opacity-90 p-6 rounded-xl w-80 text-center shadow-lg"> {/* 실제 팝업 박스 */}
        <p className="mb-6 text-lg font-medium">{message}</p> {/* 안내 문구 */}

        <div className="flex justify-center space-x-4"> {/* 버튼 두 개 사이 간격 */}
          <CustomButton
            onClick={onYes} {/* Yes 버튼 */}
            className="w-24 h-10 border border-black text-black bg-transparent"
          >
            Yes
          </CustomButton>

          <CustomButton
            onClick={onNo} {/* No 버튼 */}
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